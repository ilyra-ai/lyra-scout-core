import { defaultModules } from "@/components/ComplianceModules";

export interface AnalysisResult {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  totalFindings: number;
  criticalIssues: number;
  modules: ModuleResult[];
  entityInfo: EntityInfo;
  generatedAt: string;
}

export interface ModuleResult {
  id: string;
  name: string;
  score: number;
  risk: 'low' | 'medium' | 'high';
  findings: string[];
  sources: string[];
  status: 'completed' | 'processing' | 'pending' | 'error';
  progress: number;
}

export interface EntityInfo {
  document: string;
  type: 'cpf' | 'cnpj';
  name: string;
  status: string;
  registrationDate?: string;
  address?: string;
  activities?: string[];
}

class ComplianceService {
  // Simular dados realistas baseados no documento
  async analyzeDocument(document: string, type: 'cpf' | 'cnpj'): Promise<AnalysisResult> {
    // Simular delay de análise
    await new Promise(resolve => setTimeout(resolve, 2000));

    const entityInfo = this.generateEntityInfo(document, type);
    const modules = this.generateModuleResults(document, type);
    
    const scores = modules.map(m => m.score);
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    const highRiskModules = modules.filter(m => m.risk === 'high').length;
    const mediumRiskModules = modules.filter(m => m.risk === 'medium').length;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (highRiskModules > 2) riskLevel = 'high';
    else if (highRiskModules > 0 || mediumRiskModules > 3) riskLevel = 'medium';

    const totalFindings = modules.reduce((sum, m) => sum + m.findings.length, 0);
    const criticalIssues = modules.filter(m => m.risk === 'high').reduce((sum, m) => sum + m.findings.length, 0);

    return {
      overallScore,
      riskLevel,
      totalFindings,
      criticalIssues,
      modules,
      entityInfo,
      generatedAt: new Date().toISOString()
    };
  }

  // Simular progresso em tempo real
  async *analyzeDocumentWithProgress(document: string, type: 'cpf' | 'cnpj') {
    const modules = defaultModules.map(m => ({
      ...m,
      status: 'pending' as 'pending' | 'processing' | 'completed' | 'error',
      progress: 0,
      result: undefined
    }));

    yield { modules, isComplete: false };

    for (let i = 0; i < modules.length; i++) {
      // Simular processamento do módulo
      modules[i].status = 'processing';
      yield { modules: [...modules], isComplete: false };

      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

      // Completar módulo
      modules[i].status = 'completed';
      modules[i].progress = 100;
      modules[i].result = this.generateModuleResult(modules[i].id, document, type);

      yield { modules: [...modules], isComplete: false };
    }

    // Análise completa
    const fullResult = await this.analyzeDocument(document, type);
    yield { modules, isComplete: true, result: fullResult };
  }

  private generateEntityInfo(document: string, type: 'cpf' | 'cnpj'): EntityInfo {
    if (type === 'cnpj') {
      // Dados simulados baseados em empresas reais
      const companies = [
        {
          name: "PETRÓLEO BRASILEIRO S.A. - PETROBRAS",
          status: "ATIVA",
          registrationDate: "1953-10-03",
          address: "Av. República do Chile, 65 - Centro, Rio de Janeiro - RJ",
          activities: ["Extração de petróleo e gás natural", "Refino de petróleo", "Distribuição de combustíveis"]
        },
        {
          name: "BANCO DO BRASIL S.A.",
          status: "ATIVA", 
          registrationDate: "1808-10-12",
          address: "SBS Quadra 1, Bloco C, Lote 32 - Asa Sul, Brasília - DF",
          activities: ["Banco múltiplo", "Serviços financeiros", "Seguros"]
        },
        {
          name: "MAGAZINE LUIZA S.A.",
          status: "ATIVA",
          registrationDate: "1957-11-16", 
          address: "Rua Voluntários da Franca, 1465 - Franca - SP",
          activities: ["Comércio varejista", "E-commerce", "Serviços financeiros"]
        }
      ];

      const company = companies[Math.floor(Math.random() * companies.length)];
      
      return {
        document,
        type,
        name: company.name,
        status: company.status,
        registrationDate: company.registrationDate,
        address: company.address,
        activities: company.activities
      };
    } else {
      return {
        document,
        type,
        name: "João da Silva Santos",
        status: "REGULAR"
      };
    }
  }

  private generateModuleResults(document: string, type: 'cpf' | 'cnpj'): ModuleResult[] {
    return defaultModules.map(module => ({
      ...this.generateModuleResult(module.id, document, type),
      id: module.id,
      name: module.name,
      status: 'completed' as const,
      progress: 100
    }));
  }

  private generateModuleResult(moduleId: string, document: string, type: 'cpf' | 'cnpj'): ModuleResult {
    const moduleConfigs = {
      cadastral: {
        name: "Validação Cadastral",
        baseScore: 85,
        sources: ["Receita Federal", "MinhaReceita.org", "CNPJA API"],
        findings: [
          "Dados cadastrais atualizados",
          "Endereço confirmado",
          "Situação regular na Receita Federal"
        ]
      },
      societario: {
        name: "Quadro Societário",
        baseScore: 75,
        sources: ["MinhaReceita.org", "CNPJA API", "Diário Oficial"],
        findings: [
          "3 sócios identificados",
          "Participações societárias mapeadas",
          "Histórico de alterações disponível"
        ]
      },
      sancoes: {
        name: "Sanções Nacionais/Internacionais",
        baseScore: 60,
        sources: ["CADIN", "CEIS/CNEP", "ONU Sanctions", "EU Sanctions"],
        findings: [
          "1 registro no CADIN (R$ 50.000)",
          "Sem sanções internacionais",
          "Histórico de pendências fiscais"
        ]
      },
      processos: {
        name: "Processos Judiciais",
        baseScore: 55,
        sources: ["JusBrasil", "TRF", "TJ-SP", "TST"],
        findings: [
          "12 processos cíveis em andamento",
          "3 processos trabalhistas ativos",
          "2 processos fiscais arquivados"
        ]
      },
      fiscal: {
        name: "Situação Fiscal",
        baseScore: 70,
        sources: ["Receita Federal", "PGFN", "Secretaria Estadual"],
        findings: [
          "ICMS em atraso - SP (R$ 125.000)",
          "Certidão Federal regular",
          "Parcelamentos ativos"
        ]
      },
      trabalhista: {
        name: "Relações Trabalhistas",
        baseScore: 65,
        sources: ["MPT", "ReclameAqui", "TST"],
        findings: [
          "3 denúncias no MPT em 2023",
          "Score ReclameAqui: 7.2/10",
          "Histórico de processos trabalhistas"
        ]
      },
      publico: {
        name: "Relação Setor Público",
        baseScore: 80,
        sources: ["Portal da Transparência", "Gov.br Compras"],
        findings: [
          "Contratos públicos ativos: R$ 2.5M",
          "Sem restrições para contratar",
          "Histórico de licitações regular"
        ]
      },
      ambiental: {
        name: "Conformidade Ambiental",
        baseScore: 45,
        sources: ["IBAMA", "ICMBio", "CETESB", "INEMA"],
        findings: [
          "1 multa IBAMA pendente (R$ 250.000)",
          "Licenças ambientais em dia",
          "2 autuações em 2023"
        ]
      },
      midia: {
        name: "Análise Reputacional",
        baseScore: 72,
        sources: ["Google News", "G1", "UOL", "LinkedIn"],
        findings: [
          "Menções positivas: 65%",
          "Crises reputacionais em 2022",
          "Presença digital ativa"
        ]
      },
      lgpd: {
        name: "Compliance LGPD",
        baseScore: 78,
        sources: ["ANPD", "HaveIBeenPwned"],
        findings: [
          "Política de privacidade atualizada",
          "Sem vazamentos reportados",
          "DPO designado"
        ]
      },
      contabil: {
        name: "Conformidade Contábil",
        baseScore: 85,
        sources: ["JUCESP", "Diário Oficial"],
        findings: [
          "Demonstrações financeiras em dia",
          "Balanços publicados regularmente",
          "Contador responsável ativo"
        ]
      },
      lavagem: {
        name: "Risco Lavagem Dinheiro",
        baseScore: 70,
        sources: ["COAF", "Banco Central", "PEPs"],
        findings: [
          "Setor de médio risco",
          "Sem relação com PEPs",
          "Movimentações dentro da normalidade"
        ]
      },
      fornecedores: {
        name: "Fornecedores e Terceiros",
        baseScore: 82,
        sources: ["Cadastro Nacional", "MinhaReceita.org"],
        findings: [
          "Fornecedores mapeados: 245",
          "85% com situação regular",
          "Due diligence atualizada"
        ]
      },
      portais: {
        name: "Portais Oficiais",
        baseScore: 90,
        sources: ["Receita Federal", "Banco Central", "Simples Nacional"],
        findings: [
          "Situação regular em todos os órgãos",
          "Optante do Simples Nacional",
          "Cadastros atualizados"
        ]
      },
      capacidade: {
        name: "Capacidade Operacional",
        baseScore: 68,
        sources: ["LinkedIn", "Google", "Site Corporativo"],
        findings: [
          "150 funcionários ativos",
          "Presença digital estabelecida",
          "Capacidade técnica adequada"
        ]
      }
    };

    const config = moduleConfigs[moduleId as keyof typeof moduleConfigs];
    if (!config) {
      return {
        id: moduleId,
        name: "Módulo Desconhecido",
        score: 50,
        risk: 'medium',
        findings: ["Análise não disponível"],
        sources: [],
        status: 'error',
        progress: 0
      };
    }

    // Adicionar variação baseada no documento para tornar mais realista
    const variation = (document.charCodeAt(0) % 30) - 15; // -15 a +15
    const finalScore = Math.max(0, Math.min(100, config.baseScore + variation));

    let risk: 'low' | 'medium' | 'high' = 'low';
    if (finalScore < 50) risk = 'high';
    else if (finalScore < 75) risk = 'medium';

    return {
      id: moduleId,
      name: config.name,
      score: finalScore,
      risk,
      findings: config.findings,
      sources: config.sources,
      status: 'completed',
      progress: 100
    };
  }
}

export const complianceService = new ComplianceService();