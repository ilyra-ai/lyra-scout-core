import re

def clean_document(value: str) -> str:
    """Remove non-numeric characters from document"""
    return re.sub(r'\D', '', value)

def is_valid_cpf(cpf: str) -> bool:
    """Validate CPF with check digits"""
    cpf = clean_document(cpf)
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False
    
    # Calculate first check digit
    sum1 = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digit1 = (sum1 * 10) % 11
    if digit1 == 10:
        digit1 = 0
    
    # Calculate second check digit
    sum2 = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digit2 = (sum2 * 10) % 11
    if digit2 == 10:
        digit2 = 0
    
    return cpf[9:] == f"{digit1}{digit2}"

def is_valid_cnpj(cnpj: str) -> bool:
    """Validate CNPJ with check digits"""
    cnpj = clean_document(cnpj)
    if len(cnpj) != 14 or cnpj == cnpj[0] * 14:
        return False
    
    # Calculate first check digit
    weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum1 = sum(int(cnpj[i]) * weights1[i] for i in range(12))
    digit1 = sum1 % 11
    digit1 = 0 if digit1 < 2 else 11 - digit1
    
    # Calculate second check digit
    weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum2 = sum(int(cnpj[i]) * weights2[i] for i in range(13))
    digit2 = sum2 % 11
    digit2 = 0 if digit2 < 2 else 11 - digit2
    
    return cnpj[12:] == f"{digit1}{digit2}"

def validate_document(document: str) -> dict:
    """Validate and return document info"""
    cleaned = clean_document(document)
    
    if len(cleaned) == 11:
        return {
            "valid": is_valid_cpf(cleaned),
            "type": "cpf",
            "document": cleaned
        }
    elif len(cleaned) == 14:
        return {
            "valid": is_valid_cnpj(cleaned),
            "type": "cnpj", 
            "document": cleaned
        }
    else:
        return {
            "valid": False,
            "type": "unknown",
            "document": cleaned
        }
