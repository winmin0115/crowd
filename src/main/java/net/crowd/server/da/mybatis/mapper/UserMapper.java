package net.crowd.server.da.mybatis.mapper;

import net.crowd.server.entity.User;
import net.crowd.server.entity.UserInCompany;
import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;

@Mapper
public interface UserMapper {
    //
    public void insert(User user);

    public User selectUserByPhoneNumber(String phoneNumber);

    UserInCompany selectUserByPhoneNumberAndCompanyId(HashMap map);

    public void insertUserInCompany(UserInCompany uic);
}
