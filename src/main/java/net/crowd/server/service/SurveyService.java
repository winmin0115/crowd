package net.crowd.server.service;

import net.crowd.server.entity.Survey;

public interface SurveyService {
    public Survey getSurveyByCompanyIdAndNoAnswer(long company_id);
}
