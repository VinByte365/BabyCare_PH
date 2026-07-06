# Make models accessible from Base for migrations
from app.core.database import Base
from app.models.user import User
from app.models.baby import Baby
from app.models.analytics import AnalyticsEvent
from app.models.skin_check import SkinCheckSession
from app.models.symptom_check import SymptomCheckSession
from app.models.bookmark import Bookmark
from app.models.community import CommunityPost, CommunityComment, PostLike
from app.models.refresh_token import RefreshToken
from app.models.medical_history import MedicalHistory
from app.models.vaccination import Vaccination
from app.models.notification import Notification
