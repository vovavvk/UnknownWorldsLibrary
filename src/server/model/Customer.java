package server.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Customer {
private int uid;
private String username;
private String email;
private String phone;
private String password;
private String nickname;
private String description;
private String photo_url;

public Customer() {
}

public Customer(int uId, String userName,String eMail, String pHone, String pAssword, String nickName, String dEscription, String pHoto_url) {
	this.uid=uId;
	this.username=userName;
	this.email=eMail;
	this.phone=pHone;
	this.password=pAssword;
	this.nickname=nickName;
	this.description=dEscription;
	this.photo_url=pHoto_url;
}

public Customer(ResultSet rs) throws SQLException {
	this.uid=rs.getInt("uid");
	this.username=rs.getString("username");
	this.email=rs.getString("email");
	this.phone=rs.getString("phone");
	this.password=rs.getString("password");
	this.nickname=rs.getString("nickname");
	this.description=rs.getString("description");
	this.photo_url=rs.getString("photo_url");
}

public int getUid() {
	return uid;
}

public void setUid(int uid) {
	this.uid = uid;
}

public String getUsername() {
	return username;
}

public void setUsername(String username) {
	this.username = username;
}

public String getEmail() {
	return email;
}

public void setEmail(String email) {
	this.email = email;
}

public String getPhone() {
	return phone;
}

public void setPhone(String phone) {
	this.phone = phone;
}

public String getPassword() {
	return password;
}

public void setPassword(String password) {
	this.password = password;
}

public String getNickname() {
	return nickname;
}

public void setNickname(String nickname) {
	this.nickname = nickname;
}

public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
}

public String getPhoto_url() {
	return photo_url;
}

public void setPhoto_url(String photo_url) {
	this.photo_url = photo_url;
}

}