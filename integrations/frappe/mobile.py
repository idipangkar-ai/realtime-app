"""Copy to realtime_marketplace/api/mobile.py in the Frappe app."""

import frappe
from frappe.sessions import get_csrf_token

from realtime_marketplace.api.orders import get_dashboard_context, _require_login


@frappe.whitelist(methods=["GET"])
def get_session():
    """Return only the authenticated caller's own session and profile.

    Login still uses Frappe's standard /api/method/login (including its password
    policy, rate limiting, and authentication checks). No API keys are created.
    """
    _require_login()
    context = get_dashboard_context()
    return {
        "sid": frappe.session.sid,
        "csrf_token": get_csrf_token(),
        **context,
    }
