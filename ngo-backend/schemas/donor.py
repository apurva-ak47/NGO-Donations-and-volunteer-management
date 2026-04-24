from pydantic import BaseModel


class DonorProfileUpdate(BaseModel):
    name: str
    phone: str
    address: str
