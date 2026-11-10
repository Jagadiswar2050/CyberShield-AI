import re
from typing import List, Dict, Any

VERIFIED_KNOWLEDGE_BASE = [
    {
        "id": "kb_1930_emergency",
        "title": "National Cyber Crime Emergency Protocol & 1930 Helpline",
        "category": "emergency_reporting",
        "source_org": "Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs",
        "source_url": "https://cybercrime.gov.in/",
        "last_verified": "2024-10-15",
        "keywords": ["1930", "helpline", "emergency", "lost money", "scam", "complaint", "fir", "police", "golden hour", "freeze account"],
        "content": (
            "If you have suffered an unauthorized financial transaction or cyber fraud:\n"
            "1. ACT IN THE GOLDEN HOUR (Within 2 to 3 hours of fraud): Immediately call national helpline 1930.\n"
            "2. The 1930 system (Citizen Financial Cyber Fraud Reporting and Management System - CFCFRMS) connects "
            "directly with banks, payment aggregators, and wallets to place a temporary freeze on defrauded funds before criminals can withdraw them.\n"
            "3. Lodge a formal digital complaint at the National Cyber Crime Reporting Portal: https://cybercrime.gov.in/\n"
            "4. Contact your bank immediately using the phone number printed on the back of your debit/credit card to block the card, UPI ID, or account.\n"
            "Note: CyberShield AI is an educational platform and CANNOT file complaints, contact banks, or freeze funds on your behalf."
        )
    },
    {
        "id": "kb_upi_fraud",
        "title": "UPI Fraud Mechanics: Collect Requests, QR Codes, and PIN Misconceptions",
        "category": "upi_safety",
        "source_org": "National Payments Corporation of India (NPCI) & RBI",
        "source_url": "https://www.npci.org.in/",
        "last_verified": "2024-09-20",
        "keywords": ["upi", "qr code", "collect request", "pin", "scan", "receive money", "olx", "marketplace", "fake payment"],
        "content": (
            "Golden Rule of UPI:\n"
            "YOU NEVER NEED TO ENTER YOUR UPI PIN OR SCAN A QR CODE TO RECEIVE MONEY.\n"
            "Entering a PIN ALWAYS results in money DEBITED from your account.\n\n"
            "Common Scams:\n"
            "- QR Code Scam: Fraudster claims to send advance payment for an item you are selling (e.g., OLX), sends a QR code and asks you to scan it to 'receive' money.\n"
            "- Collect Request Scam: Fraudster sends a payment collect request with a note like 'Government Refund Approved' or 'Cashback Received'. Tapping 'Approve' and entering PIN transfers money to fraudster.\n"
            "- Pending Transaction Scam: Fraudster claims money is pending and sends a fake link. Never click unknown short-links."
        )
    },
    {
        "id": "kb_remote_access",
        "title": "Remote Access Tool Scams & Malicious APKs",
        "category": "device_security",
        "source_org": "CERT-In (Indian Computer Emergency Response Team)",
        "source_url": "https://www.cert-in.org.in/",
        "last_verified": "2024-08-10",
        "keywords": ["remote access", "anydesk", "teamviewer", "rustdesk", "apk", "app", "electricity bill", "kyc update", "screen share"],
        "content": (
            "Fraudsters frequently pose as bank officials, telecom providers, or electricity department staff threatening disconnection.\n"
            "They instruct victims to install apps like AnyDesk, TeamViewer QuickSupport, RustDesk, or download custom .apk files (e.g. 'e-electricity_update.apk').\n"
            "Once installed, these tools grant the attacker full remote viewing and control of your phone screen, allowing them to read incoming OTPs and authorize transactions.\n\n"
            "Prevention:\n"
            "- Never install remote access applications on the instruction of any caller.\n"
            "- Never install apps outside the official Google Play Store or Apple App Store.\n"
            "- If an unknown app was installed, immediately turn off Wi-Fi/Mobile Data, disconnect your SIM, and uninstall the app or perform a factory reset."
        )
    },
    {
        "id": "kb_rbi_liability",
        "title": "Customer Liability in Unauthorized Electronic Banking Transactions",
        "category": "banking_regulations",
        "source_org": "Reserve Bank of India (RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18)",
        "source_url": "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040",
        "last_verified": "2024-06-01",
        "keywords": ["rbi", "zero liability", "bank liability", "refund", "unauthorized transaction", "third party breach", "negligence"],
        "content": (
            "Under RBI's charter on Customer Protection for Electronic Banking Transactions:\n"
            "1. Zero Liability of a Customer:\n"
            "   - Contributory fraud/negligence/deficiency on the part of the bank (regardless of whether transaction is reported or not).\n"
            "   - Third-party breach where deficiency lies neither with bank nor customer, provided the customer notifies the bank within THREE working days of receiving communication.\n"
            "2. Limited Liability:\n"
            "   - If reported within 4 to 7 working days, maximum customer liability ranges from ₹5,000 to ₹25,000 depending on account type.\n"
            "3. Customer Negligence:\n"
            "   - If the customer deliberately shared credentials (e.g. willingly gave OTP, PIN, or password to another person), the customer bears the entire loss until the unauthorized transaction is reported to the bank."
        )
    }
]

class RAGEngine:
    """Retrieval-Augmented Generation & Educational Assistant Engine."""

    def __init__(self):
        self.documents = VERIFIED_KNOWLEDGE_BASE

    def search_relevant_docs(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        query_terms = re.findall(r"\w+", query.lower())
        scored_docs = []

        for doc in self.documents:
            score = 0
            doc_text = (doc["title"] + " " + doc["content"] + " " + " ".join(doc["keywords"])).lower()
            for term in query_terms:
                if len(term) <= 2:
                    continue
                if term in doc["keywords"]:
                    score += 5
                if term in doc["title"].lower():
                    score += 3
                if term in doc_text:
                    score += 1
            if score > 0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scored_docs[:top_k]]

    def generate_response(self, user_query: str) -> Dict[str, Any]:
        """
        Generates an educational, source-grounded response for cyber-safety questions.
        Enforces strict safety boundaries and provides 1930 emergency referral.
        """
        # Safety checks for sensitive data disclosure
        otp_patterns = re.findall(r"\b\d{4,6}\b", user_query)
        has_card_number = bool(re.search(r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b", user_query))
        
        warning_notice = None
        if has_card_number or (otp_patterns and any(w in user_query.lower() for w in ["pin", "otp", "cvv", "password"])):
            warning_notice = (
                "⚠️ SECURITY ALERT: Please DO NOT type your actual Card Number, CVV, OTP, or PIN here. "
                "CyberShield AI will NEVER ask for your banking credentials and does not store sensitive card data."
            )

        matched_docs = self.search_relevant_docs(user_query, top_k=2)
        
        citations = []
        if matched_docs:
            context_blocks = []
            for d in matched_docs:
                context_blocks.append(f"### {d['title']}\n{d['content']}")
                citations.append({
                    "title": d["title"],
                    "source_org": d["source_org"],
                    "source_url": d["source_url"],
                    "last_verified": d["last_verified"]
                })
            knowledge_text = "\n\n".join(context_blocks)
        else:
            knowledge_text = (
                "While our indexed database does not contain a specific match for your inquiry, remember these universal cyber-safety principles:\n"
                "1. Banks, RBI, and police NEVER ask for your password, PIN, or OTP over the phone or SMS.\n"
                "2. Receiving money via UPI NEVER requires entering your UPI PIN.\n"
                "3. Never install remote-screen sharing tools (like AnyDesk or QuickSupport) upon a stranger's request."
            )
            citations.append({
                "title": "National Cyber Crime Reporting Portal",
                "source_org": "Ministry of Home Affairs",
                "source_url": "https://cybercrime.gov.in/",
                "last_verified": "2024-10-15"
            })

        response_body = (
            f"{warning_notice + chr(10) + chr(10) if warning_notice else ''}"
            f"{knowledge_text}\n\n"
            f"---\n"
            f"🚨 **Emergency Action Step:** If you have experienced a financial cyber loss, IMMEDIATELY call **1930** "
            f"or submit an official complaint at **https://cybercrime.gov.in/**. Notify your bank within 3 days for zero-liability protection under RBI guidelines."
        )

        return {
            "query": user_query,
            "response": response_body,
            "citations": citations,
            "emergency_helpline": "1930",
            "emergency_portal": "https://cybercrime.gov.in/",
            "creator_attribution": {
                "owner": "Thallapaka Jagadiswar",
                "website": "https://www.audit3a.com/"
            },
            "disclaimer": "CyberShield AI is an informational educational assistant, not an official grievance officer or police reporting desk."
        }

rag_engine = RAGEngine()

