import { z } from "zod";
import * as Enum from "./enums";
import * as Z from './utilities';

// TODO:
// 1. refactor address/location into nested subschema
// 2. refactor contact into nested subschema
// 3. determine approach to recommended vs optional (show warnings?)
// 4. determine approach to string lengths exceeding recommended limit (show warnings?)
// 5. determine whether to enforce some numerical fields be positive or non-negative
// 6. determine capitalization (e.g. GWP, A4)
// 7. determine approach to descriptions - currently they alternate between labels, questions, and imperatives

// #region SUBSCHEMAS

export const FuelTypeQuantity = z.object({
  fuel_type: Enum.FuelTypes,
  // TODO: should units be selectable between kBtu and kWh?
  value: Z.Num.describe('Value in kBtu'),
  carbon_factor: Z.Num.describe("What is the carbon factor associated with the selected fuel type? (in kgCO2e/MWh)"),
});

export const EndUseQuantity = z.object({
  end_use: Enum.EndUses,
  // TODO: should units be selectable between kBtu and kWh?
  value: Z.Num.describe('Value in kBtu'),
  carbon_factor: Z.Num.describe("What is the carbon factor associated with the selected energy end use type? (in kg CO2e/MWh)"),
});

export const WaterType = z.object({
  water_type: Enum.WaterTypes,
  consumption: Z.Num.describe("First year as-designed water or wastewater volume (in m3/year)"),
});

export const Impacts = z.object({
  GWP_total: Z.Num.describe("Total quantity (in kg CO2e) of GWP. If more granular breakout of GWP fossil, GWP bio, and GWP luluc are provided, this is the sum of all."),
  GWP_fossil: Z.NumOrNull.describe("Total quantity (in kg CO2e) of GWP fossil"),
  GWP_luluc: Z.NumOrNull.describe("Total quantity (in kg CO2e) of GWP luluc (land use and land use change)"),
  GWP_bio_total: Z.NumOrNull.describe("Total quantity (in kg CO2e) of GWP biogenic"),
  GWP_bio_emissions: Z.NumOrNull.describe("Total quantity (in kg CO2e) of GWP biogenic emissions"),
  GWP_bio_storage: Z.NumOrNull.describe("Total quantity (in kg CO2e) of GWP biogenic storage"),
  AP_total: Z.NumOrNull.describe("Total quantity (in kg SO2e) of AP (acidification potential of land and water)"),
  EP_total: Z.NumOrNull.describe("Total quantity (in kg PO4e) of EP (eutrophication potential)."),
  ODP_total: Z.NumOrNull.describe("Total quantity (kg CFC-11e) of ODP (ozone depletion potential). "),
  POCP_total: Z.NumOrNull.describe("Total quantity (kg C2H4e) of POCP (photochemical ozone creation potential aka photochemical smog potential)"),
  ADP_total: Z.NumOrNull.describe("Total quantity (kg Sbe) of ADP (abiotic depletion potential)"),
  CED_total: Z.NumOrNull.describe("Total quantity (MJ) of CED (cumulative energy demand)"),
});

export const ImpactsOrNull = Impacts.nullable().default(null);

export const ImpactsB6 = Impacts.merge(z.object({
  energy_use_predicted_net: Z.Num.describe("What is the overall predicted net (less on site renewable energy generation) energy use in kBTU?"),
  energy_use_predicted_gross: Z.Num.describe("What is the overall predicted gross Energy use in kBTU?"),
  // TODO: confirm nested array makes sense to capture quantity per each end-use/fuel-type
  energy_end_uses: FuelTypeQuantity.array().default([]),
  fuel_types: EndUseQuantity.array().default([])
}));

export const ImpactsB6OrNull = ImpactsB6.nullable().default(null);

export const ImpactsB7 = Impacts.merge(z.object({
  water_source_provider: Z.Str.describe("Name of water source provider or wasteater handling utility"),
  // TODO: confirm nested array makes sense to capture quantity per each water-type
  water_type: WaterType.array().default([])
}));

export const ImpactsB7OrNull = ImpactsB6.nullable().default(null);

export const Stages = z.object({
  A1A3: ImpactsOrNull.describe("Life Cycle Stage A1-A3 Product Stage"),
  A4: ImpactsOrNull.describe("Life Cycle Stage A4 Transportation"),
  A5_total: ImpactsOrNull.describe("Life Cycle Stage A5 Construction Installation Process. If more granular breakout of A5 emissions is provided, the below referenced values are the sum of each sub-stage (A5.1-A5.4)"),
  A5_1: ImpactsOrNull.describe("Life Cycle Stage A5.1 Pre-Construction Demolition includes Demolition/ deconstruction of existing buildings and structures, and/ or parts thereof, including transport from site and waste processing of removed materials."),
  A5_2: ImpactsOrNull.describe("Life Cycle Stage A5.2 Construction Activities includes Site preparation; temporary works; ground works; connection to utilities; transport and onsite storage of construction products, materials and equipment; onsite production/assembly of products; works for the installation and ancillary materials (e.g. formworks and their disposal); heating/ cooling/ventilation of site facilities; energy and water use for construction processes and landscaping"),
  A5_3: ImpactsOrNull.describe("Life Cycle Stage A5.3 Waste and Waste Management includes Production, transportation, storage and end-of-life treatment and disposal of any material/waste onsite; transport, waste management and disposal of packing materials."),
  A5_4: ImpactsOrNull.describe("Life Cycle Stage A5.4 Worker Transport includes emissions of site workers traveling to and from site."),
  B1_total: ImpactsOrNull.describe("Life Cycle Stage B1 Use Stage - Installed product in use. If more granular breakout provided for stages B1.1 and B1.2, this is the sum of those."),
  B1_1: ImpactsOrNull.describe("Life Cycle Stage B1.1 - Material Emissions and Uptake"),
  B1_2: ImpactsOrNull.describe("Life Cycle Stage B1.1 - Fugitive Emissions"),
  B2: ImpactsOrNull.describe("Life Cycle Stage B2 - Maintenance Emissions"),
  B3: ImpactsOrNull.describe("Life Cycle Stage B3 - Repair Emissions"),
  B4: ImpactsOrNull.describe("Life Cycle Stage B4 - Replacement Emissions"),
  B5: ImpactsOrNull.describe("Life Cycle Stage B5 - Refurbishment Emissions"),
  B6: ImpactsB6OrNull.describe("Life Cycle Stage B6 - Operational Energy"),
  B7: ImpactsB7OrNull.describe("Life Cycle Stage B7 - Operational Water Use"),
  B8: ImpactsOrNull.describe("Life Cycle Stage B8 - Other Operational Processes"),
  C1: ImpactsOrNull.describe("Life Cycle Stage C1 - Deconstruction"),
  C2: ImpactsOrNull.describe("Life Cycle Stage C2 - EOL Transport"),
  C3: ImpactsOrNull.describe("Life Cycle Stage C3 - Waste Processing for Recovery"),
  C4: ImpactsOrNull.describe("Life Cycle Stage C3 - EOL Disposal"),
  D_total: ImpactsOrNull.describe("Life Cycle Stage D - Benefits and loads beyond the system boundary (Reuse, Recovery, Recycling potential). If more granular breakout of D stage results provided (D1 and D2), this is the sum of those."),
  D1: ImpactsOrNull.describe("Life Cycle Stage D1 - All environmental loads and benedits from future substitution of resources due to reused products, recycled materials, secondary fuelds, and recovered energy leaving a project for use in a subsequent product system as material."),
  D2: ImpactsOrNull.describe("Life Cycle Stage D2 - All environmental loads and benefits for recovered and exported energy used to meet the energy demand outside of the project."),
});

export const StagesOrNull = Stages.nullable().default(null);

export const Elements = z.object({
  substructure: StagesOrNull,
  shell_superstructure: StagesOrNull,
  shell_exterior_enclosure: StagesOrNull,
  interior_construction: StagesOrNull,
  interior_finishes: StagesOrNull,
  services_mep: StagesOrNull,
  sitework: StagesOrNull,
  equipement: StagesOrNull,
  furnishings: StagesOrNull,
  infrastructure: StagesOrNull,
});

export const ImpactSchema = z.object({
  GWP_A0: Z.NumOrNull,
  GWP_A1A3_fossil: Z.NumOrNull,
  GWP_A1A3_bio_emissions: Z.NumOrNull,
  GWP_A1A3_bio_storage: Z.NumOrNull,
  GWP_A4_fossil: Z.NumOrNull,
  GWP_A4_bio_emissions: Z.NumOrNull,
  GWP_A4_bio_storage: Z.NumOrNull,
  GWP_A5_fossil: Z.NumOrNull,
  GWP_A5_bio_emissions: Z.NumOrNull,
  GWP_A5_bio_storage: Z.NumOrNull,
  GWP_A5_1_fossil: Z.NumOrNull.describe("A5.1 Pre-Construction Demolition includes Demolition/ deconstruction of existing buildings and structures, and/ or parts thereof, including transport from site and waste processing of removed materials."),
  GWP_A5_1_bio_emissions: Z.NumOrNull,
  GWP_A5_1_bio_storage: Z.NumOrNull,
  GWP_A5_2_fossil: Z.NumOrNull.describe("A5.2 Construction Activities includes Site preparation; temporary works; ground works; connection to utilities; transport and onsite storage of construction products, materials and equipment; onsite production/assembly of products; works for the installation and ancillary materials (e.g. formworks and their disposal); heating/ cooling/ventilation of site facilities; energy and water use for construction processes and landscaping"),
  GWP_A5_2_bio_emissions: Z.NumOrNull,
  GWP_A5_2_bio_storage: Z.NumOrNull,
  GWP_A5_3_fossil: Z.NumOrNull.describe("A5.3 Waste and Waste Management includes Production, transportation, storage and end-of-life treatment and disposal of any material/waste onsite; transport, waste management and disposal of packing materials."),
  GWP_A5_3_bio_emissions: Z.NumOrNull,
  GWP_A5_3_bio_storage: Z.NumOrNull,
  GWP_A5_4_fossil: Z.NumOrNull.describe("A5.4 Worker Transport includes emissions of site workers traveling to and from site."),
  GWP_A5_4_bio_emissions: Z.NumOrNull,
  GWP_A5_4_bio_storage: Z.NumOrNull,
  GWP_B1_fossil: Z.NumOrNull,
  GWP_B1_bio_emissions: Z.NumOrNull,
  GWP_B1_bio_storage: Z.NumOrNull,
  GWP_B2_fossil: Z.NumOrNull,
  GWP_B2_bio_emissions: Z.NumOrNull,
  GWP_B2_bio_storage: Z.NumOrNull,
  GWP_B3_fossil: Z.NumOrNull,
  GWP_B3_bio_emissions: Z.NumOrNull,
  GWP_B3_bio_storage: Z.NumOrNull,
  GWP_B4_fossil: Z.NumOrNull,
  GWP_B4_bio_emissions: Z.NumOrNull,
  GWP_B4_bio_storage: Z.NumOrNull,
  GWP_B5_fossil: Z.NumOrNull,
  GWP_B5_bio_emissions: Z.NumOrNull,
  GWP_B5_bio_storage: Z.NumOrNull,
  GWP_B6_fossil: Z.NumOrNull,
  GWP_B6_bio_emissions: Z.NumOrNull,
  GWP_B6_bio_storage: Z.NumOrNull,
  GWP_B7_fossil: Z.NumOrNull,
  GWP_B7_bio_emissions: Z.NumOrNull,
  GWP_B7_bio_storage: Z.NumOrNull,
  GWP_B8_fossil: Z.NumOrNull,
  GWP_B8_bio_emissions: Z.NumOrNull,
  GWP_B8_bio_storage: Z.NumOrNull,
  GWP_C1_fossil: Z.NumOrNull,
  GWP_C1_bio_emissions: Z.NumOrNull,
  GWP_C1_bio_storage: Z.NumOrNull,
  GWP_C2_fossil: Z.NumOrNull,
  GWP_C2_bio_emissions: Z.NumOrNull,
  GWP_C2_bio_storage: Z.NumOrNull,
  GWP_C3_fossil: Z.NumOrNull,
  GWP_C3_bio_emissions: Z.NumOrNull,
  GWP_C3_bio_storage: Z.NumOrNull,
  GWP_C4_fossil: Z.NumOrNull,
  GWP_C4_bio_emissions: Z.NumOrNull,
  GWP_C4_bio_storage: Z.NumOrNull,
  GWP_D_fossil: Z.NumOrNull,
  GWP_D_bio_emissions: Z.NumOrNull,
  GWP_D_bio_storage: Z.NumOrNull,
});

export const ImpactSchemaOrNull = ImpactSchema.nullable().default(null);

// #endregion

export const ProjectData = z.object({
  id: Z.IdDefault,

  // #region NAME & LOCATION

  project_name: Z.Str.max(200).describe("Name of the project, recommended < 40 characters"),
  project_description: Z.StrOrNull.describe("A brief description of the project"),
  date_of_creation: Z.DateISODefault.describe("Date of data entry creation (yyyy-mm-dd)"),
  date_of_update: Z.DateISODefault.describe("Date of last data entry or edit (yyyy-mm-dd)"),
  date_of_submission: Z.DateISODefault.describe("Date of data entry submission (yyyy-mm-dd)"),
  // TODO: Should this be URL or base-64 encoded string?
  project_image: Z.StrOrNull.describe("Project image or rendering"),
  // project_image: Z.StrOrNull.describe("Path or URL to the project image or rendering"),
  data_entry_contact_first_name: Z.StrOrNull.describe("First Name of person submitting data on behalf of project."),
  data_entry_contact_last_name: Z.StrOrNull.describe("Last Name of person submitting data on behalf of project."),
  data_entry_contact_email: Z.EmailOrNull.describe("Email of person submitting data on behalf of project."),
  plus_code: Z.StrOrNull,
  project_address: Z.StrOrNull.describe("Project address"),
  project_address_lookup: Z.AddressLookupOrNull.describe("Project address lookup"),
  project_location_city: Z.StrOrNull.describe("Project city"),
  project_state_or_province: Z.StrOrNull.describe("Project state"),
  project_country: Enum.ISO_3166_1_A3.describe("Project country"),
  project_postal_code: Z.Str.describe("Project postal code (only first 3 digits required for Canada)"),
  project_climate_zone: Enum.ClimateZones.nullable().default(null).describe("Climate Zone per IECC"),
  lat: Z.Lat.describe("Latitude, as a signed decimal (-90 ≤ value ≤ 90)"),
  lng: Z.Lon.describe("Longitude, as a signed decimal (-180 ≤ value ≤ 180)"),
  governing_code: Z.StrOrNull.describe("Local or state building code, or IBC/IRC version if no local code exists."),
  project_data_anonymized: Z.BoolDefaultFalse.describe("Has project data been anonymized?"),
  project_certifications_commitments: Enum.Certifications.array().default([]).describe("Is project pursuing third party certification(s) and/or will the data for this project be submitted to a commitment program or other database?"),

  // #endregion
  // #region OWNER

  project_owner_contact_first_name: Z.StrOrNull.describe("First name of owner contact"),
  project_owner_contact_last_name: Z.StrOrNull.describe("Last name of owner contact"),
  owner_organization: Z.StrOrNull.describe("Name of owner's organization/company"),
  owner_web_domain: Z.UrlOrNull.describe("Web Domain of Owner"),
  owner_country: Enum.ISO_3166_1_A3.nullable().default(null).describe("Location of owner headquarters"),
  owner_email: Z.StrOrNull.describe("Owner's/Primary Contact's Email address"),
  owner_type: Enum.OwnerType.describe("Owner Type"),
  owners_representative: Z.StrOrNull.describe("Name of owner's representative"),

  // #endregion
  // #region TEAM

  architect_of_record: Z.StrOrNull.describe("Architect of Record (AOR)"),
  org_office: Z.StrOrNull.describe("Studio or office of User, within firm"),
  general_contractor: Z.StrOrNull.describe("General Contractor (GC)"),
  mep_engineer: Z.StrOrNull.describe("MEP Engineer of Record"),
  sustainability_consultant: Z.StrOrNull.describe("Green Building Consultant"),
  structural_engineer: Z.StrOrNull.describe("Structural Engineer"),
  civil_engineer: Z.StrOrNull.describe("Civil Engineer"),
  landscape_consultant: Z.StrOrNull.describe("Landscape Consultant"),
  interior_designer: Z.StrOrNull.describe("Interior Designer"),
  other_project_team: Z.StrOrNull.describe("Other Project Stakeholder Org"),

  // #endregion
  // #region SCHEDULE

  project_status: Enum.ProjectStatus.nullable().default(null).describe("Project status at time of data submission."),
  project_construction_start_date: Z.DateISOOrNull.describe("Anticipated development start date"),
  project_construction_completion_date: Z.DateISOOrNull.describe("Expected or actual construction end date for asset"),
  project_original_date_existing_building: Z.DateISOOrNull.describe("Construction date (if known) or year original asset was constructed (for existing buildings)"),

  // #endregion
  // #region OCCUPANCY

  occupant_load: Z.NumNonNegOrNull.describe("Number of people permitted to occupy the asset."),
  full_time_equivalent: Z.NumNonNegOrNull.describe("For commercial projects, enter the FTE. Full-Time Equivalent (FTE): Represents the number of regular building occupants who spend 40 hours per week (8 hours per day) in the project building.Total FTE Occupants = Total Occupant Hours ÷ 8. For example, if you have 80 part-time employees working one hour per day, the FTE would be calculated as (80 part-time employees * 1 hour/day) ÷ 8 = 10 FTE​ (LEED)"),
  anticipated_start_building_occupancy: Z.DateISOOrNull.describe("Anticipated Start of Occupancy (letter of occupancy)"),
  residential_units: Z.NumNonNegOrNull.describe("Number of residential units (if applicable)"),
  bedroom_count: Z.NumNonNegOrNull.describe("Enter the number of bedrooms (if residential asset). Count bedroom units in studios as 0.5 and count 1 bedroom + den units as 1.5"),

  // #endregion
  // #region USE & TYPE

  asset_type: Enum.AssetTypes,
  omniclass_table_11_construction_entity: Enum.OmniClassTable11Uses.nullable().default(null),
  building_construction_type: Enum.BuildingConstructionTypes.describe("Asset project type"),
  building_use_type: Enum.UseTypes.describe("The usage type."),
  IBC_Construction_Type: Enum.IBCConstructionType,
  infrastructure_construction_type: Enum.InfrastructureConstructionTypes,
  infrastructure_sector_type: Enum.SectorTypes,
  infrastructure_use_type: Enum.InfrastructureUseTypes.describe("The infrastructure project usage type"),
  project_surroundings: Enum.ProjectSurroundings.nullable().default(null).describe("Type of area surrounding the asset"),
  development_site_type: Enum.DevelopmentSite.nullable().default(null).describe("This field identifies whether the lot being developed is a greenfield or brownfield site. A greenfield site refers to undeveloped land, usually agricultural or natural land, while a brownfield site refers to previously developed land that may be contaminated but has potential for redevelopment."),
  project_historic: Z.BoolOrNull.describe("Whether or not asset is of historical/cultural value"),
  energy_code: Enum.EnergyCodes.nullable().default(null).describe("Project energy code used"),

  // #endregion
  // #region SIZE

  project_units: Enum.UnitSystem.describe("The preferred units this project was entered in. This field has no effect on the data formats, but is useful in restoring the original units when displaying buildings."),
  gfa_measurement_method: Enum.AreaMeasurementMethod,
  built_floor_area: Z.NumNonNeg.describe("Equals the gross floor area plus parking area located inside the building shell/enclosed attached parking. Also referred to as 'constructed floor area'."),
  gross_floor_area: Z.NumNonNeg.describe("The gross floor area (GFA) associated with the selected usage type.  If multiple use types are selected, provide the GFA associated with each usage type"),
  project_site_area: Z.NumNonNegOrNull.describe("The total area within the legal property boundaries of a site. This encompasses all areas of the site, including both constructed and non-constructed areas. The project site area includes the building footprint, hardscapes (like parking and sidewalks), utility installations (such as septic or stormwater treatment equipment), and landscaped areas."),
  project_work_area: Z.NumNonNegOrNull.describe("The Project Area must include all areas that are disturbed by the project work, including any areas used during construction, utility conveyance or staging. This is area at ground surface."),
  building_footprint_area: Z.NumNonNegOrNull.describe("The area of building footprint, not including hardscapes, landscapes, and other siteworks that occur outside of the perimeter of the building footprint"),
  conditioned_floor_area: Z.NumNonNegOrNull.describe("The floor area within the building that is conditioned (heated or cooled). Spaces actively managed for temperature, humidity, and air quality using HVAC systems, providing a controlled and comfortable environment for occupants."),
  unconditioned_floor_area: Z.NumNonNegOrNull.describe("The floor area within the building that is not conditioned. Spaces actively managed for temperature, humidity, and air quality using HVAC systems, providing a controlled and comfortable environment for occupants."),
  enclosed_parking_area: Z.NumNonNeg.describe("Parking area that is enclosed and/or attached to the building shell. This measurement excludes surface parking lots or parking structures that are entirely separate from the building."),
  detached_parking_area: Z.NumNonNegOrNull.describe("Parking are that is not attached to the building shell. The sum of the area of both surface parking and detached parking structures."),
  surface_parking_area: Z.NumNonNegOrNull.describe("Refers to an open, ground-level parking facility where vehicles are parked directly on a paved surface. This type of parking area is not enclosed within a building and does not include structured parking, such as multi-level parking garages or underground parking facilities."),
  detached_parking_structure_area: Z.NumNonNegOrNull.describe("refers to the area of a parking facility that is physically separated from the main building or structure it serves. This type of parking structure is typically a standalone facility, such as a parking garage, that is not directly attached to the main building by structural elements like walls or roofs."),
  stories_above_grade: Z.NumNonNegOrNull.describe("Number of stories above grade"), // could be zero
  stories_below_grade: Z.NumNonNegOrNull.describe("Number of stories below grade"), // could be zero
  interstitial_floors: Z.NumNonNegOrNull,
  building_height: Z.NumPos.describe("Total height of the building above finished ground level, per ASCE 7-16"),
  mean_roof_height: Z.NumPosOrNull.describe("Project mean roof height"),
  window_wall_ratio: Z.NumNonNegOrNull.describe("The ratio of the window area to the gross exterior wall area"),
  thermal_envelope_area: Z.NumNonNegOrNull.describe("The thermal envelope of a building includes all the exterior surfaces that enclose the conditioned space and separate it from unconditioned spaces or the outdoors. This includes walls, floors, roofs, windows, and doors. The thermal envelope area is crucial for determining the energy efficiency of a building, as it impacts heat loss and gain. Most standards and guidelines, including ASHRAE, IECC, DOE, and Passive House, recommend measuring from the exterior dimensions of the building. This method ensures that the entire surface area exposed to external conditions is accounted for."),

  // #endregion
  // #region COSTS

  currency_code: Enum.CurrencyCodes.nullable().default(null).describe("Local currency alphabetic code per ISO 4217"),
  total_cost: Z.NumOrNull.describe("Total Project Cost"),
  hard_cost: Z.NumOrNull.describe("hard costs (building materials, total construction cost)"),
  soft_cost: Z.NumOrNull.describe("design/consultant fees, overhead, project admin"),
  siteworks_cost: Z.NumOrNull.describe("Project estimated siteworks cost"),
  cost_source: Enum.CostSources.nullable().default(null).describe("Whether or not cost is estimated or actual"),
  cost_notes: Z.StrOrNull,

  // #endregion
  // #region STRUCTURAL

  system_column_grid_long: Z.NumNonNegOrNull.describe("Typical floor live load in pounds per square foot or square meter."),
  system_risk_category: Enum.RiskCategories.nullable().default(null).describe("Project Risk Category based on IBC definition"),
  system_live_load: Z.NumNonNegOrNull.describe("Typical floor live load in pounds per square foot"),
  system_snow_load: Z.NumNonNegOrNull.describe("Code-determined ground snow load in pounds per square foot or square meter."),
  system_wind_speed_asce7: Z.NumNonNegOrNull.describe("Code-determined ultimate wind speed in miles per hour or km per hour. per ASCE 7-16"),
  eartquake_importance_factor: Enum.EarthquakeImportanceFactor.nullable().default(null).describe("Earthquake Importance Factor, per National Building Code of Canada, 2020 table 4.1.8.5."),
  system_seismic_design_category_ibc: Enum.SeismicDesignCategory.nullable().default(null).describe("Seismic design category, as determined by IBC"),
  primary_horizontal_gravity_system: Enum.HorizontalGravitySystem.nullable().default(null).describe("Primary horizontal gravity system"),
  secondary_horizontal_gravity_system: Enum.HorizontalGravitySystem.nullable().default(null).describe("Secondary horizontal gravity system"),
  primary_vertical_gravity_system: Enum.VerticalGravitySystem.nullable().default(null).describe("Primary vertical gravity system"),
  secondary_vertical_gravity_system: Enum.VerticalGravitySystem.nullable().default(null).describe("Secondary vertical gravity system"),
  system_lateral_system: Enum.LateralSystem.nullable().default(null).describe("Primary lateral system"),
  system_podium: Enum.SystemPodium.nullable().default(null).describe("Whether or not project is podium construction"),
  // TODO: shouldn't this be a number?
  system_allowable_soil_bearing_pressure: Z.StrOrNull.describe("Allowable soil bearing pressure, as reported by the geotechnical engineer (psf)"),
  system_foundation_type: Enum.SystemFoundationType.nullable().default(null).describe("Typical foundation type"),

  // #endregion
  // #region LCA INFO

  tool_report_upload: Z.Any.describe("Upload report from LCA tool."),
  report_name: Z.StrOrNull.describe("Filename of the LCA Results. Must be unique"),
  additional_lca_report_names: Z.StrOrNull.describe("Filename of the additional LCA Results that must be submitted apart from the main LCA Result"),
  assessor_name: Z.StrOrNull.describe("Name of assessor"),
  assessor_email: Z.EmailOrNull.describe("Email of assessor"),
  assessor_organization: Z.StrOrNull.describe("Assessor company or organization"),
  assessment_year: Z.Year.describe("Year when data reported"),
  assessment_date: Z.DateISOOrNull.describe("Date of assessment"),
  project_phase_at_reporting: Enum.ProjectPhase.nullable().default(null).describe("The phase of the project when the LCA or carbon assessment was reported to database, commitment, or certification program."),
  project_phase_at_time_of_assessment: Enum.ProjectPhase.describe("The phase of the project when the LCA or carbon assessment was completed."),
  tool_lca: Enum.LCATool.describe("What tool was used to conduct the assessment?"),
  lca_tool_version_type: Z.StrOrNull.describe("Version of tool and type used to conduct the assessment. For cloud tools, enter the date of the analysis."),
  assessment_life_cycle_stages: Enum.LCAStages.array().default([]),
  required_service_life: Z.NumNonNegOrNull.describe("Service life required by the client or through regulations."),
  reference_study_period: Z.NumNonNeg.describe("Reference study period used in assessment modeling, if use and end of life phases included."),
  material_quantity_source: Enum.MaterialQtySource.nullable().default(null).describe("Main source of material quantities used in assessment."),
  material_quantity_source_detail: Z.StrOrNull.describe("If more than one material quantity source selected, provide additonal detail on which materials and systems apply to each material quantity source."),

  // #endregion
  // #region ENERGY

  tool_energy_modeling: Enum.EnergyModel.describe("What tool was used to perform the energy modeling?"),
  energy_model_methodology_reference: Z.StrOrNull.describe("The energy modeling reference standard used."),
  energy_model_tool_version: Z.StrOrNull.describe("The version of software used for energy modeling"),
  gwp_energy_sources_year: Enum.GWPEnergySource.nullable().default(null),
  site_location_weather_data: Z.StrOrNull.describe("The building or project site location's weather data information based on the information available in ASHRAE's Weather Data Viewer. Documentation shall state the weather station name, World Meterological Organization (WMO) station identifier, and ASHRAE Climate Zone per ASHRAE Standard 169, and year of accessing the weather file. (requirements per ASHRAE/ICC Standard 240P)"),
  electricity_provider: Z.StrOrNull.describe("Name of Electricity Source Provider"),
  electricity_source: Enum.ElectricitySource.nullable().default(null).describe("The type of electricity source."),
  electricity_carbon_factor: Z.NumNonNegOrNull.describe("Electricity carbon factor (in kg CO2e/MWh) stated as either a single annualized value, or as a list of sub-annual schedule-based values"),
  electricity_carbon_factor_source: Z.StrOrNull.describe("State the source of the electricity carbon factor."),

  // #endregion
  // #region METHODOLOGY

  assessment_purpose: Z.StrOrNull.describe("Describe the purpose or goal of the assessment. Per EN 15978, the purpose of the assessment is defined by the goal, the scope, and the intended use of the assessment. The goal of the assessment is to quantify the environmental performance of teh objcet of assessment by means of compilation of environmental information. Include whether the results of the assessment will be used for for reporting to a commitment program, third party certification program, and/or for code compliance."),
  assessment_methodology_description: Z.StrOrNull.describe("Describe the methodology used to conduct the assessment. "),
  lcia_method: Z.StrOrNull.describe("Life Cycle Impact Assessment method"),
  qa_user_notes: Z.StrOrNull.describe("List any other notes about the model content or quality that might be helpful for conducting QA"),
  assessment_uncertainty: Z.StrOrNull.describe("Describe any uncertainty factors included in the assessment. Confirm whether a contingency factor was applied based on project phase and if so, which life cycle modules, elements, and/or materials the contingency factor was applied to. Confirm if any data uncertainty factors were applied and if so, which life cycle modules, elemts, and/or materials the data uncertainty factor was applied to. Confirm if any uncertainty factors were applied to material quantities and provide a detailed description."),
  assessment_cutoff_method: Z.StrOrNull.describe("Describe the cutoff method used, if any, including the standard if applicable, the type (cost, mass, etc.), and quantity (percentage, specific values, etc.)"),

  // #endregion
  // #region COMPLIANCE

  iso21931_compliance: Z.BoolOrNull.describe("Was the assessment conducted in accordance with ISO21931-1:2022?"),
  en15978_compliance: Z.BoolOrNull.describe("Was the assessment conducted in accordance  with EN 15978-1?"),
  rics_2017_compliance: Z.BoolOrNull.describe("Was the assessment conducted in accordance with RICS Whole Life Carbon Assessment - 1st edition (2017)?"),
  rics_2023_compliance: Z.BoolOrNull.describe("Was the assessment conducted in accordance with RICS Whole Life Carbon Assessment - 2nd edition (2023)?"),
  ashraeicc_240p_compliance: Z.BoolOrNull.describe("Was the assessment conducted in accordance with ASHRAE/ICC Standard 240P Quantification of Life Cycle Greenhouse Gas Emissions in Buildings?"),
  sei_prestandard_compliance: Z.BoolOrNull.describe("Was the assessment conducted in accordance with the SEI Prestandard for Assessing the Embodied Carbon of Structural Systems for Buildings?"),
  assessment_verified: Z.BoolOrNull.describe("Whether or not assessment has been third-party verified"),
  assessment_verifier: Z.StrOrNull.describe("Name of third party verifier"),
  assessment_validity_period: Z.StrOrNull.describe("Period for which assessment is valid (in years)"),
  results_validation_description: Z.StrOrNull.describe("How were these results and material quantities validated?"),

  // #endregion
  // #region INCLUSIONS

  operational_energy_included: Z.Bool.describe("Is operational energy use reported? "),
  biogenic_carbon_included: Z.Bool.describe("Does the assessment account for biogenic carbon in materials entering the system boundary (negative emissions) and/or leaving the system boundary (positive emissions)?"),
  biogenic_carbon_accounting_method: Enum.BiogenicCarbonAccounting.nullable().default(null).describe("What method was used to calculate biogenic carbon?"),
  bio_sustainability_certification: Enum.BiogenicCertification.array().default([]).describe("3rd party certification for sourcing of bio-based and forestry products. Select all that apply."),
  biogenic_carbon_description: Z.StrOrNull.describe("Provide a detailed explanation of the bio-based materials used in project. Include whether biobased materials are short cycle carbon (e.g. annual plants, recycled fiber streams, residues), long cycle carbon (e.g. trees and virgin forest products) or both. Confirm if biogenic carbon impacts from live plantings are included in calculations."),
  project_refrigerants: Z.BoolOrNull.describe("Does the assessment include impacts from refrigerants?"),
  refrigerant_type_included: Enum.RefrigerantTypes.array().default([]).describe("Which refrigerants were utilized on the project and included in the assessment?"),
  fossil_gas_leakage: Z.BoolOrNull.describe("Does the assessment include impacts from fossil gas leakage?"),
  substructure_included: Z.Bool.describe("Is the substructure physical scope included in the reported calculations? (Omniclass Table 21, Level 1)"),
  substructure_scope: Enum.SubstructureScope.array().default([]).describe("Which substructure components are included in the reported calculations? Select all that apply.  (OmniClass Table 21, Level 2)"),
  shell_superstructure_included: Z.Bool.describe("Is the shell-superstructure physical scope included in the reported calculations? (Omniclass Table 21, Level 2)"),
  shell_superstructure_scope: Enum.ShellSuperstructureScope.array().default([]).describe("Which superstructure components are included in the reported calculations? Check all that apply. (OmniClass Level 3)"),
  shell_exterior_enclosure_included: Z.Bool.describe("Is the shell-exterior enclosure physical scope included in the reported calculations? (Omniclass Table 21, Level 2)"),
  shell_exterior_enclosure_scope: Enum.ShellExteriorScope.array().default([]).describe("Which shell-exterior enclosure components are included in the reported calculations? Check all that apply. (OmniClass Table 21, Level 3)"),
  interior_construction_included: Z.Bool.describe("Is the interiors - construction physical scope included in the reported calculations? (Omniclass Table 21, Level 2)"),
  interior_construction_scope: Enum.InteriorConstructionScope.array().default([]).describe("Which interior construction components are included in the reported calculations? Check all that apply. (OmniClass Table 21, Level 3)"),
  interior_finishes_included: Z.Bool.describe("Is the interiors - finishes physical scope included in the reported calculations? (Omniclass Table21, Level 2)"),
  interior_finishes_scope: Enum.InteriorFinishesScope.array().default([]).describe("Which interiors - finishes components are included in the reported GWP calculations? Select all that apply. (OmniClass Table 21, Level 3)"),
  services_mep_included: Z.Bool.describe("Is the services physical scope included in the reported calculations? (Omniclass Table 21, Level 1)"),
  services_mechanical_scope: Enum.ServicesMechanicalScope.array().default([]).describe("Which mechanical components are included in the reported calculations? Select all that apply. (per ASHRAE 240P)"),
  services_electrical_scope: Enum.ServicesElectricalScope.array().default([]).describe("Which electrical components are included in the reported calculations? Select all that apply. (per ASHRAE 240P)"),
  services_plumbing_scope: Enum.ServicesPlumbingScope.array().default([]).describe("Which plumbing and fire protection components are included in the reported calculations? Select all that apply"),
  sitework_included: Z.Bool.describe("Is the sitework physical scope included in the reported calculations? (Omniclass Table 21, Level 1)"),
  sitework_scope: Enum.SiteworkScope.array().default([]).describe("Which sitework components are included in the reported calculations? Select all that apply. (Omniclass Table 21, Level 2)"),
  equipment_included: Z.Bool.describe("Is equipment includedin the reported calculations?  (Omniclass Table 21, Level 2)"),
  equipment_scope: Enum.EquipmentScope.array().default([]).describe("Which equipment components are included in the reported calculations? Select all that apply. (per Omniclass Table 21, Level 3)"),
  furnishings_included: Z.Bool.describe("Are furnishings included in the reported calculations? (Omniclass Table 21, Level 2)"),
  furnishings_scope: Enum.FurnishingScope.array().default([]).describe("Which furnishings components are included in the reported calculations? Select all that apply. (Omniclass Table 21, Level 3)"),
  infrastructure_components_included: Z.Bool.describe("Are infrastructure components included in the reported calculations?"),
  lca_requirements: Z.StrOrNull.describe("Does the project have to meet GWP and/or other LCA requirements as set forth by project owner, federal or local policy, code, project team or other entity? If so, explain explain the requirements in detail. "),

  // #endregion
  // #region LCA RESULTS

  GWP_total: Z.NumOrNull.describe("Total project GWP in kilograms of CO2 equivalent, excluding biogenic carbon"),
  GWP_total_site_area: Z.NumOrNull.describe("kg CO2e"),
  GWP_intensity_per__building_area: Z.NumOrNull.describe("kg CO2e/m2"),
  GWP_intensity_per_site_area: Z.NumOrNull.describe("kg CO2e/m2"),

  elements: Elements,

  // #endregion
  // #region REDUCTION STRATEGIES

  reduction_baseline: Z.StrOrNull.describe("If a baseline scenario assessment was conducted, enter the total GWP of the baseline model here."),
  reduction_percentage_from_referenced: Z.NumOrNull.describe("Percent reduction from a baseline (if applicable)"),
  reduction_description: Z.StrOrNull.describe("Describe reduction strategies pursued"),
  // TODO: consider replacing reduction_description with multiselect  
  // reduction_strategies: Enum.ReductionStrategies.array().default([]).describe("Select reduction strategies pursued")

  // #endregion

});
