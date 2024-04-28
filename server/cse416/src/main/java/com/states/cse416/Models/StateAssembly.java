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
@Document(collection = "state_assembly")
public class StateAssembly {
    @Id
    private ObjectId id;
    private int District;
    private String Name;
    private String Party;
    private String Race_ethnicity;
    private String Vote_Margin;
    private String Photo;

    @DocumentReference
    private List<District> districtsList;
}
