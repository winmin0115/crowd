package net.crowd.server.service.impl;

import net.crowd.server.da.mybatis.SurveyMybatisStore;
import net.crowd.server.entity.Survey;
import net.crowd.server.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyServiceImpl implements SurveyService {

    @Autowired
    SurveyMybatisStore surveyMybatisStore;

    @Override
    public Survey getSurveyByCompanyIdAndNoAnswer(long company_id) {
        return surveyMybatisStore.selectSurveyByCompanyIdAndNoAnswer(company_id);
    }
}
