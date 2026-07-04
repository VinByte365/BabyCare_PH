"""
 * BabyGuide PH — Analytics Endpoint
 *
 * Receives anonymized event batches from the mobile app.
 * No authentication required — events are anonymized by design.
"""

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.analytics import AnalyticsEvent
from app.schemas.analytics import AnalyticsEventBatch, AnalyticsEventResponse

router = APIRouter()


@router.post("/events", response_model=dict)
def log_analytics_events(batch: AnalyticsEventBatch, db: Session = Depends(get_db)):
    """
    Receive and store a batch of anonymized analytics events.
    """
    count = 0
    for event_data in batch.events:
        event = AnalyticsEvent(
            event_name=event_data.name,
            timestamp=event_data.timestamp,
            metadata_json=json.dumps(event_data.metadata) if event_data.metadata else None,
        )
        db.add(event)
        count += 1

    db.commit()
    return {"status": "ok", "events_stored": count}


@router.get("/events", response_model=list[AnalyticsEventResponse])
def list_analytics_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    List stored analytics events (for internal/admin use).
    """
    events = (
        db.query(AnalyticsEvent)
        .order_by(AnalyticsEvent.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return events


@router.get("/events/count", response_model=dict)
def count_analytics_events(db: Session = Depends(get_db)):
    """
    Return total event count grouped by event name (for internal/admin use).
    """
    from sqlalchemy import func as sql_func

    results = (
        db.query(
            AnalyticsEvent.event_name,
            sql_func.count(AnalyticsEvent.id).label("count"),
        )
        .group_by(AnalyticsEvent.event_name)
        .all()
    )
    return {"by_event": {r.event_name: r.count for r in results}, "total": sum(r.count for r in results)}
