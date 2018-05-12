package net.crowd.server.controller;

import net.crowd.server.entity.Survey;
import net.crowd.server.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SurveyController {

    @RequestMapping("web/companys/{companyId}/surveys")
    public String retrieveSurveyView(@PathVariable String companyId, Model model) {
        System.out.println("asdasdasd:"+companyId);
        model.addAttribute("company_id", companyId);
        return "hello";
    }
}
