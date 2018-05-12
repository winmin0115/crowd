package net.crowd.server.da.mybatis.mapper;

import net.crowd.server.entity.Company;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface CompanyMapper {
    List<Company> selectCompanyList();

    Company selectCompanyById(long companyId);
}
