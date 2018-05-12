package net.crowd.server.da.mybatis;

import net.crowd.server.da.mybatis.mapper.UserMapper;
import net.crowd.server.entity.User;
import net.crowd.server.entity.UserInCompany;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

@Repository
@Transactional
public class UserMybatisStore {
    //
    @Autowired
    UserMapper userMapper;

    public void insert(User user) {
        userMapper.insert(user);
    }

    public User selectUserByPhoneNumber(String phoneNumber) {
        return userMapper.selectUserByPhoneNumber(phoneNumber);
    }

    public UserInCompany selectUserByPhoneNumberAndCompanyId(String phoneNumber, String companyId) {
        //
        HashMap map = new HashMap();
        map.put("phone_number", phoneNumber);
        map.put("company_id", companyId);
        return userMapper.selectUserByPhoneNumberAndCompanyId(map);
    }

    public void insertUserInCompany(UserInCompany uic) {
        userMapper.insertUserInCompany(uic);
    }
}
