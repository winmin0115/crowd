package net.crowd.server.entity;

public class UserInCompany {
    //
    private String position;
    private String user_name;
    private String company_name;
    private String phone_number;
    private long point;
    private long company_id;

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getCompany_name() {
        return company_name;
    }

    public void setCompany_name(String company_name) {
        this.company_name = company_name;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public long getPoint() {
        return point;
    }

    public void setPoint(long point) {
        this.point = point;
    }

    public long getCompany_id() {
        return company_id;
    }

    public void setCompany_id(long company_id) {
        this.company_id = company_id;
    }
}
