const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface RealAnalysisResult {
  document: string;
  type: 'cpf' | 'cnpj';
  analysis: {
    overall_score: number;
    risk_level: 'low' | 'medium' | 'high';
    total_findings: number;
    critical_issues: number;
    modules: Array<{
      id: string;
      name: string;
      score: number;
      risk: 'low' | 'medium' | 'high';
      status: string;
      findings: string[];
      sources: string[];
    }>;
    entity_info: {
      name: string;
      document: string;
      status: string;
      type: string;
    };
  };
  timestamp: string;
}

export class RealComplianceService {
  private getAuthToken(): string {
    const auth = localStorage.getItem('auth');
    if (!auth) throw new Error('Authentication required');
    const { token } = JSON.parse(auth);
    return token;
  }

  async analyzeDocument(document: string, type: 'cpf' | 'cnpj'): Promise<RealAnalysisResult> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ document })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Analysis failed');
    }

    return response.json();
  }

  async *analyzeDocumentWithProgress(document: string, type: 'cpf' | 'cnpj') {
    const modules = [
      { id: 'cadastral', name: 'Análise Cadastral' },
      { id: 'sanctions', name: 'Análise de Sanções' },
      { id: 'legal', name: 'Processos Judiciais' },
      { id: 'fiscal', name: 'Situação Fiscal' },
      { id: 'media', name: 'Análise de Mídia' },
      { id: 'pep', name: 'Pessoa Politicamente Exposta' },
      { id: 'cadin', name: 'Consulta CADIN' }
    ];

    // Initialize modules
    const moduleStates = modules.map(m => ({
      ...m,
      status: 'pending' as 'pending' | 'processing' | 'completed' | 'error',
      progress: 0,
      result: undefined
    }));

    yield { modules: moduleStates, isComplete: false };

    // Simulate progressive analysis
    for (let i = 0; i < modules.length; i++) {
      moduleStates[i].status = 'processing';
      yield { modules: [...moduleStates], isComplete: false };

      await new Promise(resolve => setTimeout(resolve, 500));

      moduleStates[i].status = 'completed';
      moduleStates[i].progress = 100;
      yield { modules: [...moduleStates], isComplete: false };
    }

    // Get final analysis result
    const result = await this.analyzeDocument(document, type);
    yield { modules: moduleStates, isComplete: true, result };
  }
}

export const realComplianceService = new RealComplianceService();