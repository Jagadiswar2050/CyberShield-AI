from fastapi import APIRouter, Query
from app.ml.forecaster import financial_forecaster

router = APIRouter(prefix="/forecast", tags=["Financial Time-Series Forecast"])

@router.get("/generate")
def get_forecast(
    history_points: int = Query(18, ge=6, le=36, description="Number of historical monthly periods to simulate"),
    forecast_horizon: int = Query(6, ge=1, le=12, description="Number of future periods to predict"),
    trend_factor: float = Query(0.035, ge=0.01, le=0.10, description="Monthly growth trend slope"),
    seasonality: float = Query(0.12, ge=0.0, le=0.30, description="Cyclical seasonality amplitude")
):
    """
    Generates synthetic digital banking financial volume projection,
    along with upper and lower 95% confidence intervals and regression/smoothing metrics.
    """
    return financial_forecaster.generate_forecast(
        history_points=history_points,
        forecast_horizon=forecast_horizon,
        trend_factor=trend_factor,
        seasonality_amplitude=seasonality
    )
