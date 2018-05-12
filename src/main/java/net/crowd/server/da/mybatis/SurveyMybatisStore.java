package net.crowd.server.da.mybatis;

import net.crowd.server.da.mybatis.mapper.SurveyMapper;
import net.crowd.server.entity.Survey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class SurveyMybatisStore {
    //
   @Autowired
   SurveyMapper surveyMapper;


    public Survey selectSurveyByCompanyIdAndNoAnswer(long company_id) {
        return surveyMapper.selectSurveyByCompanyIdAndNoAnswer(company_id);
    }
}
