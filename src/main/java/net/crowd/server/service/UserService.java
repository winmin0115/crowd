package net.crowd.server.service;

import net.crowd.server.entity.TempUser;
import net.crowd.server.entity.User;
import net.crowd.server.entity.UserInCompany;

public interface UserService {
    //
    public User registerUser(User user);
    public User retrieveUser();


    public User getUserByPhoneNumber(String phoneNumber);

    public UserInCompany getFriendsList();

    public UserInCompany getUserByPhoneNumberAndCompanyId(String phoneNumber, String companyId);

    public void registerUserInCompany(long companyId, TempUser tempUser);
}
