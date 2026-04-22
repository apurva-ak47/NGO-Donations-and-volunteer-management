from pydantic import BaseModel

class UsageCreate(BaseModel):
    donation_item_id: int
    task_id: int
    quantity_used: int