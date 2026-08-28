package com.taskmanager.dto;

import lombok.Data;

@Data
public class AddMemberRequest {
   private Long userId;  // email of user to add
}
