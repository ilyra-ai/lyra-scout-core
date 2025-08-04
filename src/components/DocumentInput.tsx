import { useState } from "react";
import { Search, FileText, Building2, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface DocumentInputProps {
  onAnalyze: (document: string, type: 'cpf' | 'cnpj') => void;
  isLoading: boolean;
}

export const DocumentInput = ({ onAnalyze, isLoading }: DocumentInputProps) => {
  const [document, setDocument] = useState("");
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj' | null>(null);
  const { toast } = useToast();

  const validateAndDetectType = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length === 11) {
      return 'cpf';
    } else if (cleanValue.length === 14) {
      return 'cnpj';
    }
    return null;
  };

  const formatDocument = (value: string, type: 'cpf' | 'cnpj') => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (type === 'cpf') {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const handleInputChange = (value: string) => {
    const type = validateAndDetectType(value);
    setDocumentType(type);
    
    if (type) {
      setDocument(formatDocument(value, type));
    } else {
      setDocument(value);
    }
  };

  const handleAnalyze = () => {
    if (!documentType || !document) {
      toast({
        title: "Documento inválido",
        description: "Por favor, insira um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.",
        variant: "destructive",
      });
      return;
    }

    onAnalyze(document, documentType);
  };

  const handleExampleCNPJ = () => {
    const petrobras = "33.000.167/0001-01"; // Petrobras
    setDocument(petrobras);
    setDocumentType('cnpj');
  };

  const handleExampleCPF = () => {
    const example = "123.456.789-00"; // Exemplo
    setDocument(example);
    setDocumentType('cpf');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span>Análise de Compliance</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Insira um CPF ou CNPJ para análise completa de due diligence
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Digite o CPF ou CNPJ..."
                value={document}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-lg h-12"
                maxLength={18}
              />
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={!documentType || isLoading}
              className="h-12 px-8 bg-gradient-primary hover:opacity-90"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analisar
                </>
              )}
            </Button>
          </div>

          {documentType && (
            <div className="flex items-center justify-center space-x-2">
              {documentType === 'cpf' ? (
                <User className="h-4 w-4 text-primary" />
              ) : (
                <Building2 className="h-4 w-4 text-primary" />
              )}
              <Badge variant="secondary" className="text-sm">
                {documentType === 'cpf' ? 'Pessoa Física (CPF)' : 'Pessoa Jurídica (CNPJ)'}
              </Badge>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Exemplos para teste:
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExampleCNPJ}
              className="text-xs"
            >
              <Building2 className="h-3 w-3 mr-1" />
              CNPJ Petrobras
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExampleCPF}
              className="text-xs"
            >
              <User className="h-3 w-3 mr-1" />
              CPF Exemplo
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Fontes de Dados Oficiais:</p>
              <p>
                Este sistema consulta exclusivamente fontes públicas e oficiais como 
                Receita Federal, Banco Central, CADIN, CEIS/CNEP, ONU, União Europeia 
                e outros órgãos governamentais para garantir a veracidade das informações.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};