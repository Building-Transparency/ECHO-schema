import { z } from "zod";
import * as Enum from "./enums";
import * as Z from './utilities';

// TODO:
// 1. refactor address/location into nested subschema
// 2. refactor contact into nested subschema
// 3. determine approach to recommended vs optional (show warnings?)
// 4. determine approach to string lengths exceeding recommended limit (show warnings?)
// 5. determine which numerical fields must be positive and which could be zero

export const ProjectData = z.object({
  id: Z.IdDefault,

  // #region NAME & LOCATION

  // TODO: force hard length limit?
  project_name: Z.Str.describe("Name of the project, recommended < 40 characters")
    .transform(value => ({ value, warnings: value.length < 40 ? [] : ["Recommended under 40 characters"] })),
  date_of_creation: Z.DateISODefault.describe("Date of data entry creation (yyyy-mm-dd)"),
  date_of_update: Z.DateISODefault.describe("Date of last data entry or edit (yyyy-mm-dd)"),
  date_of_submission: Z.DateISODefault.describe("Date of data entry submission (yyyy-mm-dd)"),
  // TODO: confirm that this is correct type or whether this needs union of z.tuple([Num, Num]) and OpenLocationSchema
  plus_code: Z.Str.array().default([]),
  project_address: Z.StrOrNull.describe("Project address"),
  // TODO: recommend removing in favor of sepate lat lon with independent validation, perhaps nested under location schema
  // latlng: StrOrNull.describe("The geographic coordinates of the project. Latitude and Longitude auto-populated"),
  project_address_lookup: Z.AddressLookupOrNull.describe("Project address lookup"),
  project_location_city: Z.StrOrNull.describe("Project city"),
  project_state_or_province: Z.StrOrNull.describe("Project state"),
  project_country: Enum.ISO_3166_1_A3.describe("Project country"),
  project_postal_code: Z.Str.describe("Project postal code (only first 3 digits required for Canada)"),
  project_climate_zone: Enum.ClimateZones.nullable().default(null).describe("Climate Zone per IECC (e.g., 1A, 2B, etc.)"),
  lat: Z.Lat.nullable().default(null).describe("Latitude, as a signed decimal (-90 ≤ value ≤ 90)"),
  lng: Z.Lon.nullable().default(null).describe("Longitude, as a signed decimal (-180 ≤ value ≤ 180)"),
  project_image: Z.StrOrNull.describe("Path or URL to the project image or rendering"),
  building_code: Z.StrOrNull.describe("Local or state building code, or IBC/IRC version if no local code exists."),

  // TODO: confirm that this ought to be an array as a project could pursue multiple
  project_certifications: Enum.Certifications.array().default([]).describe("Is project pursuing third party certification(s)?"),

  // #endregion
  // #region CONFIDENTIALITY

  // TODO: confirm defaults should be initialized to the values shown here for next 4 lines
  project_data_anonymized: Z.BoolDefaultFalse.describe("Has project data been anonymized?"),
  allow_benchmarking: Z.BoolDefaultFalse.describe("This may be combined with other data to generate published results as long as details cannot be extracted"), // TODO: default = false?
  allow_publication: Z.BoolDefaultFalse.describe("This may be shared with project details disclosed openly."),
  project_confidentiality: Z.BoolDefaultTrue.describe("Is project confidential?"),

  // #endregion
  // #region OWNER

  project_owner_contact: Z.StrOrNull.describe("Name of owner"),
  owner_organization: Z.StrOrNull.describe("Name of owner's organization/company"),
  owner_web_domain: Z.UrlOrNull.describe("Web Domain of Owner"),
  owner_location: Z.StrOrNull.describe("Mailing Address (address, city, state, ZIP/mailing code, country)"),
  owner_country: Enum.ISO_3166_1_A3.nullable().default(null).describe("Location of owner headquarters"),
  owner_email: Z.StrOrNull.describe("Owner's/Primary Contact's Email address"),
  owner_phone: Z.PhoneOrNull.describe("Owner's phone number"),
  owner_type: Enum.OwnerType.describe("Owner Type"),
  owners_representative: Z.StrOrNull.describe("Name of owner's representative"),

  // #endregion
  // #region TEAM

  architect_of_record: Z.StrOrNull.describe("Architect of Record (AOR)"),
  project_user_studio: Z.StrOrNull.describe("Studio or office of User, within firm"),
  general_contractor: Z.StrOrNull.describe("General Contractor (GC)"),
  mep_engineer: Z.StrOrNull.describe("MEP Engineer of Record"),
  sustainability_consultant: Z.StrOrNull.describe("Green Building Consultant"),
  structural_engineer: Z.StrOrNull.describe("Structural Engineer"),
  civil_engineer: Z.StrOrNull.describe("Civil Engineer"),
  landscape_consultant: Z.StrOrNull.describe("Landscape Consultant"),
  interior_designer: Z.StrOrNull.describe("Interior Designer"),
  // TODO: should these be appended _1, _2, _3 or just be an array of strings
  other_project_team: Z.StrOrNull.describe("Other Project Team Member"),
  // other_project_team: Z.StrOrNull.describe("Other Project Team Member"),
  // other_project_team: Z.StrOrNull.describe("Other Project Team Member"),

  // #endregion
  // #region SCHEDULE

  project_status: Enum.ProjectStatus.nullable().default(null),
  date_design_completion: Z.DateISOOrNull,
  project_construction_start_date: Z.DateISOOrNull.describe("Anticipated development start date"),
  project_construction_completion_date: Z.DateISOOrNull.describe("Expected or actual construction end date for asset"),
  project_original_date_existing_building: Z.DateISOOrNull.describe("Construction date (if known) or year original asset was constructed (for existing buildings)"),

  // #endregion
  // #region OCCUPANCY

  project_avg_occupants: Z.NumOrNull,
  anticipated_start_building_occupancy: Z.DateISOOrNull,

  // #endregion
  // #region TYPE & SIZE

  project_units: Enum.UnitSystem.describe("The preferred units this project was entered in. This field has no effect on the data formats, but is useful in restoring the original units when displaying buildings."),
  asset_type: Enum.AssetTypes,
  building_project_construction_type: Enum.BuildingConstructionTypes.describe("Asset project type"),
  building_project_construction_type_2: Enum.BuildingConstructionTypes2,
  infrastructure_project_construction_type: Enum.InfrastructureConstructionTypes,
  infrastructure_sector_type: Enum.SectorTypes,
  building_use_type: Enum.UseTypes.describe("The usage type."),
  infrastructure_use_type: Enum.InfrastructureUseTypes.describe("The infrastructure project usage type"),
  gross_floor_area: Z.NumPos.describe("The gross floor area associated with the selected usage type"),
  gross_floor_area_measurement_method: Enum.AreaMeasurementMethod.nullable().default(null)
    .transform(value => ({ value, warnings: value != null ? [] : ['Recommended'] })),
  project_work_area_m2: Z.NumPos.describe("The Project Area must include all areas that are disturbed by the project work, including any areas used during construction, utility conveyance or staging."),
  building_footprint_area_m2: Z.NumPos.describe("Area of building footprint, not including hardscapes, landscapes, and other siteworks that occur outside of the perimeter of the building footprint"),
  project_site_area_m2: Z.NumPos.describe("Equals project_work_area minus building_footprint_area"),
  conditioned_floor_area_m2: Z.NumNonNegOrNull,
  unconditioned_floor_area_m2: Z.NumNonNegOrNull,
  enclosed_parking_area_m2: Z.NumNonNegOrNull.describe("Parking area that is inside of the building shell"),
  detached_parking_area_m2: Z.NumNonNegOrNull.describe("Parking are that is not attached to the building shell"),
  IBC_Construction_Type: Enum.IBCConstructionType,
  project_description: Z.StrOrNull.describe("A brief description of the project"),
  project_surroundings: Enum.ProjectSurroundings.nullable().default(null).describe("Type of area surrounding the asset"),
  project_historic: Z.BoolOrNull.describe("Whether or not asset is of historical/cultural value"),
  project_energy_code: Enum.EnergyCodes.nullable().default(null).describe("Project energy code used"),
  // project_description: // TODO: Confirm removed duplicate
  project_stories_above_grade: Z.NumNonNeg.describe("Number of stories above grade"), // could be zero
  project_stories_below_grade: Z.NumNonNeg.describe("Number of stories below grade"), // could be zero
  occupant_load: Z.NumNonNegOrNull.describe("Number of people permitted to occupy the building."),
  building_height: Z.NumPos.describe("Total height of the building above finished ground level, per ASCE 7-16"),
  mean_roof_height: Z.NumPosOrNull.describe("Project mean roof height"),
  window_wall_ratio: Z.NumNonNegOrNull.describe("The ratio of the window area to the gross exterior wall area"),
  thermal_envelope_area: Z.NumNonNegOrNull.describe("The total area of all the surfaces that separate the heated interior from the unheated exterior of the dwelling"),
  residential_units: Z.NumNonNegOrNull.describe("Number of residential units (if applicable)"),

  // #endregion
  // #region COSTS

  project_total_cost_currency: Z.NumOrNull,
  local_currency_alphabetic_code: Enum.CurrencyCodes.nullable().default(null).describe("Local currency alphabetic code per ISO 4217"),
  project_total_cost: Z.NumOrNull.describe("Total Project Cost "),
  project_hard_cost: Z.NumOrNull.describe("hard costs (building materials, total construction cost)"),
  project_soft_cost: Z.NumOrNull.describe("design/consultant fees, overhead, project admin"),
  project_siteworks_cost: Z.NumOrNull.describe("Project estimated siteworks cost"),
  project_cost_source: Enum.CostSources.nullable().default(null).describe("Whether or not cost is estimated or actual"),

  // #endregion
  // #region BUILDING TECH

  // TODO: refactor into a number + unit (SI/IP)
  average_r_value_walls: Z.StrOrNull,
  // TODO: refactor into a number + unit (SI/IP)
  average_r_value_roofs: Z.StrOrNull,

  // TODO: either make unit explicit or provide SI/IP option
  system_column_grid_long: Z.NumNonNegOrNull.describe("Typical column grid spacing in the long direction in feet"),
  system_risk_category: Enum.RiskCategories.nullable().default(null).describe("Project Risk Category based on IBC definition"),
  system_live_load: Z.NumNonNegOrNull.describe("Typical floor live load in pounds per square foot"),
  system_snow_load: Z.NumNonNegOrNull.describe("Code-determined ground snow load in pounds per square foot"),
  system_wind_speed: Z.NumNonNegOrNull.describe("Code-determined ultimate wind speed in miles per hour"),
  system_seismic_design_category: Enum.SeismicDesignCategory.nullable().default(null).describe("Seismic design category, as determined by IBC"),
  system_horizontal_gravity_system: Enum.HorizontalGravitySystem.nullable().default(null).describe("Primary horizontal gravity system"),
  system_vertical_gravity_system: Enum.VerticalGravitySystem.nullable().default(null).describe("Primary vertical gravity system"),
  system_lateral_system: Enum.LateralSystem.nullable().default(null).describe("Primary lateral system"),
  system_podium: Enum.SystemPodium.nullable().default(null).describe("Whether or not project is podium construction"),
  // TODO: confirm use of number rather than dropdown
  system_allowable_soil_bearing_pressure_psf: Z.NumNonNegOrNull.describe("Allowable soil bearing pressure, as reported by the geotechnical engineer (psf)"),
  system_foundation_type: Enum.SystemFoundationType.nullable().default(null).describe("Typical foundation type"),
  secondary_horizontal_gravity_system: Z.StrOrNull,
  secondary_vertical_gravity_system: Z.StrOrNull,

  // #endregion
  // #region CARBON ASSESSMENT

  lca_tool_report_upload: Z.Any.describe("Upload report from LCA tool. JSON Format is tool-specific"),
  lca_report_name: Z.StrOrNull.describe("Filename of the LCA Results. Must be unique"),
  additional_lca_report_names: Z.StrOrNull.describe("Filename of the additional LCA Results that must be submitted apart from the main LCA Result"),
  assessment_assessor_name: Z.StrOrNull.describe("Name of assessor"),
  assessment_assessor_email: Z.EmailOrNull.describe("Email of assessor"),
  assessment_assessor_organization: Z.StrOrNull.describe("Assessor company or organization"),
  assessment_year: Z.YearDefaultNow.describe("Year when data reported"),
  assessment_date: Z.DateISOOrNull.describe("Date of assessment"),
  project_phase_at_reporting: Enum.ProjectPhase.nullable().default(null),
  project_phase_at_time_of_assessment: Enum.ProjectPhase.nullable().default(null),
  project_phase_at_time_of_assessment_2: Enum.ProjectPhase.nullable().default(null),
  assessment_tool: Enum.LCATool.nullable().default(null),
  assessment_tool_version: Z.StrOrNull,
  assessment_life_cycle_stages: Enum.LCAStages.array().default([]),
  project_tool_energy_modeling: Enum.EnergyModel.nullable().default(null),
  project_expected_life: Z.NumNonNegOrNull,
  assessment_reference_study_period: Z.NumNonNeg,
  purpose_of_assessment: Enum.AssessmentPurposes.array().default([]),
  assessment_quantity_source: Enum.MaterialQtySource.nullable().default(null),

  // #endregion
  // #region INCLUSIONS

  assessment_cutoff_type: Enum.CutoffMethod.nullable().default(null).describe("The method of calculating assessment cutoff."),
  assessment_cutoff: Z.NumOrNull.describe("The approximate percentage of materials included in the assessment by mass"),
  assessment_cost_cutoff: Z.BoolOrNull.describe("Are 95% of materials by cost included in the assessment?"),
  operational_energy_included: Z.Bool.describe("Is operational energy use reported? "),
  biogenic_carbon_storage_included: Z.Bool.describe("If assessment includes biogenic carbon storage in building materials."),
  biogenic_carbon_storage_description: Z.StrOrNull.describe("Description of biogenic carbon"),
  project_refrigerants: Z.BoolOrNull.describe("Does the project use refrigerants?"),
  refrigerants_included: Z.BoolOrNull.describe("Was the refrigerant(s) considered as part of the LCA use stages?"),
  refrigerants_type_included: Enum.RefrigerantTypes.array().default([]).describe("Which refrigerants were utilized on the project and included in the assessment?"),
  substructure_included: Z.Bool.describe("Substructure physical scope included? (Omniclass Level 1)"),
  substructure_components_included: Enum.SubstructureScope.array().default([]).describe("Substructure components that are included in the reported GWP calculations (OmniClass Level 2)"),
  shell_superstructure_included: Z.Bool.describe("Shell - Superstructure physical scope included? (Omniclass Level 2)"),
  shell_superstructure_components_included: Enum.ShellSuperstructureScope.array().default([]).describe("Superstructure components that are included in the reported GWP calculations (OmniClass Level 3)"),
  shell_exterior_enclosure_included: Z.Bool.describe("Shell - Exterior Enclosure physical scope included? (Omniclass Level 2)"),
  shell_exterior_enclosure_components_included: Enum.ShellExteriorScope.array().default([]).describe("Shell components that are included in the reported GWP calculations (OmniClass Level 3)"),
  interior_construction_included: Z.Bool.describe("Interiors - Construction physical scope included? (Omniclass Level 2)"),
  interior_construction_components_included: Enum.InteriorConstructionScope.array().default([]).describe("Interior Construction components that are included in the reported GWP calculations (OmniClass Level 3)"),
  interiors_finishes_included: Z.Bool.describe("Interiors - Finishes physical scope included? (Omniclass Level 2)"),
  interior_finishes_components_included: Enum.InteriorFinishesScope.array().default([]).describe("Interior Construction components that are included in the reported GWP calculations (OmniClass Level 3)"),
  services_mep_included: Z.Bool.describe("Services physical scope included? (Omniclass Level 1)"),
  services_mechanical_components_included: Enum.ServicesMechanicalScope.array().default([]).describe("Mechanical components included in the reported GWP calculations"),
  services_electrical_components_included: Enum.ServicesElectricalScope.array().default([]).describe("Electrical components included in the reported GWP calculations"),
  services_plumbing_components_included: Enum.ServicesPlumbingScope.array().default([]).describe("Plumbing and fire protection components included in the reported GWP calculations"),
  sitework_included: Z.Bool.describe("Sitework physical scope included? (Omniclass Level 1)"),
  sitework_components_included: Enum.SiteworkScope.array().default([]).describe("Sitework components included in the reported GWP calculations. (Omniclass Level 2)"),
  equipment_and_furnishings_included: Z.Bool.describe("Equipment & Furnishings physical scope included? (Omniclass Level 1)"),
  infrastructure_components_included: Enum.InteriorConstructionScope.array().default([]),
  qa_user_notes: Z.StrOrNull.describe("List any other notes about the model content or quality that might be helpful for conducting QA"),

  // #endregion

  // TODO: REMAINING
  // 1. Post Construction Verification
  // 2. Carbon Assessment Results
  // 3. Reduction Strategies
  // 4. Testing

});
