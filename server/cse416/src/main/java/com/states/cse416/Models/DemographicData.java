package com.states.cse416.Models;

import com.states.cse416.Models.enums.Race;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
//@Document(collection = "demographics")
public class DemographicData {
//    @Id
//    private ObjectId id;
    @Field("TOT_POP22")
    private double totalPopulation;
    @Field("PCT_WHT")
    private double pctWhite;
    @Field("PCT_ASN")
    private double pctAsian;
    @Field("PCT_BLK")
    private double pctBlack;
    @Field("PCT_HSP")
    private double pctHispanic;
    @Field("WHT_NHSP22")
    private int whitePop;
    @Field("ASN_NHSP22")
    private int asianPop;
    @Field("BLK_NHSP22")
    private int blackPop;
    @Field("HSP_POP22")
    private int hispanicPop;
}
