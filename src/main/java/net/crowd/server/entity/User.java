package net.crowd.server.entity;

import net.crowd.server.util.JsonUtil;
import org.springframework.stereotype.Repository;


public class User{
    //
    private String access_token;
    private String id;
    private String phone_number;
    private String profile_img_url;
    private String name;
    private String position;
    private long point;

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getProfile_img_url() {
        return profile_img_url;
    }

    public void setProfile_img_url(String profile_img_url) {
        this.profile_img_url = profile_img_url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public long getPoint() {
        return point;
    }

    public void setPoint(long point) {
        this.point = point;
    }

    public String toJson(){
        return JsonUtil.toJson(this);
    }




}
