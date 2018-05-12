package net.crowd.server.da.mybatis.mapper;

import net.crowd.server.entity.Survey;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SurveyMapper {
     Survey selectSurveyByCompanyIdAndNoAnswer(long company_id);
}