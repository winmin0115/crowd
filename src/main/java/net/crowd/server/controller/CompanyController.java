package net.crowd.server.controller;

import net.crowd.server.entity.*;
import net.crowd.server.service.CompanyService;
import net.crowd.server.service.SurveyService;
import net.crowd.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CompanyController {
    //
    @Autowired
    CompanyService companyService;

    @Autowired
    UserService userService;

    @Autowired
    SurveyService surveyService;

    @GetMapping("companys")
    public List<Company> retrieveCompanys(){
        //
        return companyService.getCompanyList();
    }

    //페이스북 로직
    @GetMapping("companys/{companyId}/users/{phoneNumber}")
    public UserInCompany retrieveUserByPhoneNumberAndCompanyId(@PathVariable String companyId, @PathVariable String phoneNumber){
        return userService.getUserByPhoneNumberAndCompanyId(phoneNumber, companyId);
    }

    @GetMapping("companys/{companyId}/users/{phoneNumber}/finds/friends")
    public UserInCompany retrieveFriends(){
        //전달받은 phoneNumber을 통해서 페이스북 access_token을 디비에서 가져옴
        //access_token을 통해서 친구 리스트 불러옴
        //불러온 친구 리스트의 핸드폰 번호와 전달 받은 companyId를 조합하여 SELECT
        //이슈1)앱을 통해서 추가 정보를 입력하지 않은 사람의 정보..전화번호바꼐없다....
        //이슈1-1) 해결방안 : 있는 정보만 뿌려준다.
        return userService.getFriendsList();
    }


    @PostMapping("companys/{companyId}/users")
    public void createTempUser(@PathVariable("companyId") long companyId, @RequestBody TempUser tempUser){
        //웹페이지에서 보냄...점주 페이지에서 번호
        //long company_id = Long.parseLong(companyId);
        userService.registerUserInCompany(companyId, tempUser);
    }

    @GetMapping("companys/{companyId}/surveys")
    public Survey retrieveSurveyNoAnswer(@PathVariable("companyId") long companyId){
        return surveyService.getSurveyByCompanyIdAndNoAnswer(companyId);
    }

}
