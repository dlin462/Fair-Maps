package com.states.cse416.Models;

import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "state_assembly")
public class StateAssembly {
    @Id
    private ObjectId id;
    private String Office;
    private String Name;
    private String Party;
<<<<<<< HEAD
    @Field("Date assumed office")
    private String date_assumed_office;
    private String Ethnicity;
    @Field("Vote Margin")
    private String Vote_Margin;
    private String Image;
    private String State;
=======
    private String Race_ethnicity;
    private double voteMargin;
    private String Photo;
    private StateName stateName;
>>>>>>> fa7bda440345be9cbfa062292597e406b29406b7

    @DocumentReference
    private List<District> districtsList;
}
