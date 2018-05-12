package net.crowd.server.da.mybatis;

import net.crowd.server.da.mybatis.mapper.CompanyMapper;
import net.crowd.server.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class CompanyMybatisStore {
    //
    @Autowired
    CompanyMapper companyMapper;

    public List<Company> getCompanyList(){
        //
        return companyMapper.selectCompanyList();
    }

    public Company getCompanyById(long companyId){
        //
        return companyMapper.selectCompanyById(companyId);
    }
}
