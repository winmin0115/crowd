package net.crowd.server.entity;

public class Company {
    //
    private long id;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLa() {
        return la;
    }

    public void setLa(String la) {
        this.la = la;
    }

    public String getLo() {
        return lo;
    }

    public void setLo(String lo) {
        this.lo = lo;
    }

    public String getTotal_point() {
        return total_point;
    }

    public void setTotal_point(String total_point) {
        this.total_point = total_point;
    }

    private String name;
    private String la;
    private String lo;
    private String total_point;

    public long getStandard() {
        return standard;
    }

    public void setStandard(long standard) {
        this.standard = standard;
    }

    private long standard;

}
