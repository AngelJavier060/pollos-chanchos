from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from datetime import datetime
from ..config import settings

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.ALGORITHM]
        )
        
        # Verificar expiración
        exp = payload.get('exp')
        if not exp or datetime.utcfromtimestamp(exp) < datetime.utcnow():
            raise HTTPException(
                status_code=401,
                detail="Token expirado"
            )
            
        return payload
        
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido"
        ) 