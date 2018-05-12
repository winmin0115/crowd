package net.crowd.server.service.impl;

import net.crowd.server.da.mybatis.CompanyMybatisStore;
import net.crowd.server.entity.Company;
import net.crowd.server.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.jws.Oneway;
import java.util.List;
@Service
public class CompanyServiceImpl implements CompanyService {
    @Autowired
    CompanyMybatisStore companyMybatisStore;

    @Override
    public List<Company> getCompanyList() {
        return companyMybatisStore.getCompanyList();
    }
}
