package com.states.cse416.Models;

import com.states.cse416.Models.enums.Party;
import com.states.cse416.Models.enums.Race;
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
    @Field("Office")
    private String office;
    @Field("Name")
    private String name;
    @Field("Party")
    private Party party;
    @Field("Date assumed office")
    private String dateAssumedOffice;
    @Field("Ethnicity")
    private Race ethnicity;
    @Field("Vote Margin")
    private String voteMargin;
    private String Image;
    @Field("State")
    private StateName state;
    @Field("Image")
    private String Photo;
}
