# Make models accessible from Base for migrations
from app.core.database import Base
from app.models.user import User
from app.models.baby import Baby
from app.models.analytics import AnalyticsEvent
