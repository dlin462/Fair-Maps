package com.states.cse416.Models;

import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "state_wide_data")
public class State {
    @Id
    private ObjectId id;
    private String StateName;
    private int TOT_POP22;
    private int WHT_NHSP22;
    private int BLK_NHSP22;
    private int ASN_NHSP22;
    private int HSP_POP22;

    @DocumentReference
    private List<District> districtsList;
}
