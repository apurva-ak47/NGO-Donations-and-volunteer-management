from pydantic import BaseModel

class DonorCreate(BaseModel):
    name: str
    email: str
    phone: str
    address: str