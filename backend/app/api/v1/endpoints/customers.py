from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_role
from app.db.session import get_db
from app.models import Customer, Workspace
from app.schemas import CustomerCreate, CustomerOut

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("", response_model=list[CustomerOut])
def list_customers(
    db: Session = Depends(get_db),
    current_user: Workspace = Depends(get_current_user),
):
    workspace_id = current_user.workspace_id if hasattr(current_user, "workspace_id") and current_user.workspace_id else None
    if not workspace_id:
        return []
    return db.query(Customer).filter(Customer.workspace_id == workspace_id).all()


@router.post("", response_model=CustomerOut)
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: Workspace = Depends(get_current_user),
):
    workspace_id = current_user.workspace_id if hasattr(current_user, "workspace_id") and current_user.workspace_id else None
    if not workspace_id:
        raise HTTPException(status_code=400, detail="User is not assigned to a workspace")
    customer = Customer(name=payload.name, customer_type=payload.customer_type, workspace_id=workspace_id)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: str, db: Session = Depends(get_db), current_user: Workspace = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
