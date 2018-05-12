package net.crowd.server.service.impl;

import net.crowd.server.da.mybatis.CompanyMybatisStore;
import net.crowd.server.da.mybatis.UserMybatisStore;
import net.crowd.server.entity.Company;
import net.crowd.server.entity.TempUser;
import net.crowd.server.entity.User;
import net.crowd.server.entity.UserInCompany;
import net.crowd.server.service.UserService;
import net.crowd.server.util.CustomRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserMybatisStore userMybatisStore;

    @Autowired
    CompanyMybatisStore companyMybatisStore;

    @Override
    public User registerUser(User user) {
        //
        userMybatisStore.insert(user);
       return user;
    }

    @Override
    public User retrieveUser() {
        //
        return null;
    }

    @Override
    public User getUserByPhoneNumber(String phoneNumber) {
        return userMybatisStore.selectUserByPhoneNumber(phoneNumber);
    }

    @Override
    public UserInCompany getUserByPhoneNumberAndCompanyId(String phoneNumber, String companyId){
        //
        return userMybatisStore.selectUserByPhoneNumberAndCompanyId(phoneNumber, companyId);
    }

    @Override
    public void registerUserInCompany(long companyId, TempUser tempUser) {
        //
        UserInCompany uic = new UserInCompany();
        uic.setCompany_id(companyId);
        uic.setPhone_number(tempUser.getPhone_number());
        //회사 아이디로 셀렉트해서 고정 포인트를 가지고와야함. 그래서 더해서 해야되.
        Company company = companyMybatisStore.getCompanyById(companyId);
        long standardPoint = company.getStandard();
        uic.setPoint(standardPoint);
        uic.setPosition("temp");  // temp로할지 마케터로 할지는 추후 정해지면 //결정해야함.
        userMybatisStore.insertUserInCompany(uic);
        //설문링크 보내기.....

        try {
            //this.sendMesageAPI("https://lapi.bizlotte.com/v1/send/kakao-friend", "01033492780", "01033492780", "YTJkODNiMzMtY2FlYy00NDAwLTliODctNjVhYmJhZmRhNTg4OmI3ZmRlOGJiLTIxMTEtNGQzMC04ZmIyLTdlYjNiZDA1NjAzNg==", "0cede52df082258ff06b59c92dffff975844c35f", "설문조사 페이지 링크입니다. \\n http://www.naver.com");
            this.sendMesageAPI("http://210.93.181.229:9090/v1/send/kakao-friend", "01033492780", "01033492780", "Y2xhc3M6c2VjcmV0MTIhQA==", "d6b73318d4927aa80df1022e07fecf06c55b44bf", "설문조사 페이지 링크 - https://www.naver.com");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int sendMesageAPI(String messagePlatformUrl, String dest_phone, String send_phone, String authKey, String sender_key, String message)throws Exception{
        CustomRestTemplate restTemplate = new CustomRestTemplate("sendKaKao", 1000);
        MultiValueMap<String, String> reqHeaders = new LinkedMultiValueMap<String, String>();
        String reqBody = "";
        String resBody = "";
        reqHeaders.add("Authorization", "Basic "+authKey);
        reqHeaders.add("Content-Type", "application/json;charset=utf8");
        String code = "";
        reqBody = "{ \"msg_id\" : \"1\", \"dest_phone\" : \""+dest_phone+"\", \"send_phone\" : \""+send_phone+"\", \"sender_key\" : \""+sender_key+"\", \"msg_body\" : \""+message+"\", \"ad_flag\" : \"n\" }";
        HttpEntity<?> httpEntity = new HttpEntity<Object>(reqBody, reqHeaders);
        try
        {
            ResponseEntity<String> resEntity = restTemplate.exchange(messagePlatformUrl, HttpMethod.POST, httpEntity, String.class);
            // 4. ���� ó��
            code = resEntity.getStatusCode().toString();
            resBody = resEntity.getBody();
            System.out.println("Code : " + code);
            System.out.println("resBody : " + resBody);
        }
        catch(HttpClientErrorException | HttpServerErrorException ex)
        {
            code = ex.getStatusCode().toString();
            resBody = ex.getResponseBodyAsString();
            System.out.println(code);
            System.out.println(resBody);
        }


        return 0;

    }

    @Override
    public UserInCompany getFriendsList() {
        //전달받은 phoneNumber을 통해서 페이스북 access_token을 디비에서 가져옴
        //access_token을 통해서 친구 리스트 불러옴
        //불러온 친구 리스트의 핸드폰 번호와 전달 받은 companyId를 조합하여 SELECT
        //이슈1)앱을 통해서 추가 정보를 입력하지 않은 사람의 정보..전화번호바꼐없다....
        //이슈1-1) 해결방안 : 있는 정보만 뿌려준다.
        return null;
    }

}
