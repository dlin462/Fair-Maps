Mississippi 2022 General Election Precinct-Level Results and Boundaries

## RDH Date Retrieval
03/29/24

## Sources
MIT Election Data and Science Lab (MEDSL)

Shapes for the following counties were sourced from county sources: Amite, DeSoto, Hancock, Harrison, Lamar, Maidson, Neshoba, Newton, Okitbbeha, Panola, Perry, Pike, Prentiss, Rankin, Simpson, Stone, Tishomingo, Tunica, Warren, Washington, and Webster.

The remaining shapes were sourced from VEST 2020 Missisippi file [here](https://dataverse.harvard.edu/file.xhtml?fileId=5706487&version=42.0)

## Notes on Field Names (adapted from VEST):
Columns reporting votes generally follow the pattern:
One example is:
G16PRERTRU
The first character is G for a general election, P for a primary, S for a special, and R for a runoff.
Characters 2 and 3 are the year of the election.*
Characters 4-6 represent the office type (see list below).
Character 7 represents the party of the candidate.
Characters 8-10 are the first three letters of the candidate's last name.

*To fit within the GIS 10 character limit for field names, the naming convention is slightly different for the State Legislature and US House of Representatives. All fields are listed below with definitions.

Office Codes Used:
CON## - U.S. Congress

Party Codes Used:
D - Democratic
R - Republican
L - Libertarian

## Fields:
Field Name Description                               
UNIQUE_ID  Unique ID for each precinct               
COUNTYFP   County FIPS identifier                    
CNTY_CODE  County Code (Three-character abbreviation)
CNTY_NAME  County Name                               
POLL_LOC   Precinct Polling Location                 
GCON01DBLA US HOUSE DIANNE BLACK (DEM)               
GCON01RKEL US HOUSE TRENT KELLY (REP)                
GCON02DTHO US HOUSE BENNIE G THOMPSON (DEM)          
GCON02RFLO US HOUSE BRIAN FLOWERS (REP)              
GCON03DYOU US HOUSE SHUWASKI A YOUNG (DEM)           
GCON03RGUE US HOUSE MICHAEL GUEST (REP)              
GCON04DDUP US HOUSE JOHNNY L DUPREE (DEM)            
GCON04LJOH US HOUSE ALDEN PATRICK JOHNSON (LIB)      
GCON04REZE US HOUSE MIKE EZELL (REP)                 

## Additional Notes
MEDSL precinct-level data was checked against county-level election results. Those results were compiled by RDH staff using PDF files from the Mississippi Secretary of State with precinct-level data for each county, retrieved 9/13/23. (https://www.sos.ms.gov/elections-voting/2022-general-election-results)

All results matched.

However, a previous version of the MEDSL data (retrieved 9/7/23) was checked against those same county files from the Mississippi Secretary of State.

Totals matched in every county except for the following: Sharkey, Tallahatchie, Lee, Pontotoc, Jackson, Pearl River, Clarke, Oktibbeha, Neshoba, Rankin

There were discrepancies in 11 of 1757 precincts. In cases where precinct results did not match, MEDSL data was replaced with state data. That resolved all discrepancies.

The election results file on the RDH website was correct and remains unchanged, but we note the use of updated data from MEDSL. Full details on processing of the most recent MEDSL data can be found in the notebook linked below.

Shapes were sourced from VEST and respective county website and correspondences listed above.

## Processing Steps
Visit the RDH GitHub and the processing script for this code [here](https://github.com/nonpartisan-redistricting-datahub/pber_collection)

Please direct questions related to processing this dataset to info@redistrictingdatahub.org.