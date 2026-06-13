from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import quote, rates, rfq


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Wisor AI - Freight Quotation Platform",
    description="Convert unstructured freight inquiry emails into accurate quotations",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rfq.router)
app.include_router(quote.router)
app.include_router(rates.router)


@app.get("/")
def root():
    return {"message": "Wisor AI API", "docs": "/docs"}
