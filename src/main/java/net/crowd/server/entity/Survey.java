package net.crowd.server.entity;

import java.sql.Date;

public class Survey {
    //
    private long id;
    private long company_id;
    private String content;
    private String phone_number;
    private Date date;
    private String answer_yn;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getCompany_id() {
        return company_id;
    }

    public void setCompany_id(long company_id) {
        this.company_id = company_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getAnswer_yn() {
        return answer_yn;
    }

    public void setAnswer_yn(String answer_yn) {
        this.answer_yn = answer_yn;
    }
}
