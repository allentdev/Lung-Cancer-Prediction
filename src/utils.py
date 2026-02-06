import numpy as np

def calculate_behavior_risk(smoking_years, cigarettes_per_day, age, pollution_exposure):
    """
    Calculates the behavior risk score based on lifestyle factors.
    """
    score = 0
    score += smoking_years * 1.5
    score += cigarettes_per_day * 2
    score += (age - 30) * 0.5 if age > 30 else 0
    score += pollution_exposure * 10  # scale 0–5

    if score < 50:
        risk = "Low"
    elif score < 100:
        risk = "Medium"
    else:
        risk = "High"

    return round(score, 2), risk


def generate_recommendations(ai_result, behavior_risk):
    """
    Generates a list of recommendations based on AI prediction and behavior risk.
    """
    recommendations = []

    # Safe access to ai_result fields if it's None (though logic usually prevents this)
    ai_risk = ai_result.get("risk_level") if ai_result else "Low"

    if ai_risk == "High" or behavior_risk == "High":
        recommendations.append("Consult a pulmonologist or oncologist immediately.")
        recommendations.append("Schedule a high-resolution CT scan for detailed analysis.")
        recommendations.append("Strictly avoid smoking and polluted environments.")
        recommendations.append("Adopt a diet rich in antioxidants and maintain a healthy lifestyle.")
    elif behavior_risk == "Medium":
        recommendations.append("Reduce smoking and minimize exposure to pollutants.")
        recommendations.append("Consider periodic lung cancer screening.")
        recommendations.append("Monitor respiratory health symptoms closely.")
    else:
        recommendations.append("Maintain your current healthy lifestyle.")
        recommendations.append("Continue to avoid smoking and significant air pollution.")
        recommendations.append("Regular check-ups are always good practice.")

    return recommendations
