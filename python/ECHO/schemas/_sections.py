from pydantic import BaseModel, Field, conint, constr, conlist, condecimal, confloat, validator
from typing import List, Optional, Literal, Union
from datetime import date


###########################
# Import Literals
###########################

from ._literals import (
        AssetTypes, BuildingConstructionTypes, InfrastructureConstructionTypes,
        SectorTypes, InfrastructureUseTypes, UseTypes, EnergyCodes,
        RiskCategories, EarthquakeImportanceFactor, SeismicDesignCategory,
        HorizontalGravitySystem, VerticalGravitySystem, LateralSystem,
        SystemFoundationType, ProjectPhase, LCATool, LCAStages,
        MaterialQtySource, EnergyModel, GWPEnergySource, ElectricitySource,
        BiogenicCarbonAccounting, BiogenicCertification, SubstructureScope,
        ShellSuperstructureScope, ShellExteriorScope, InteriorConstructionScope,
        InteriorFinishesScope, ServicesMechanicalScope, ServicesElectricalScope,
        ServicesPlumbingScope, SiteworkScope, EquipmentScope, FurnishingScope,
        Certifications, OwnerType, ProjectStatus, ProjectSurroundings,
        DevelopmentSite, HistoricValue, IBCConstructionType, SystemPodium,
        RefrigerantTypes, ClimateZones, CurrencyCodes, ProjectPhaseReporting
    )


###########################
# Sections
###########################

class response_ProjectInformation(BaseModel):
    project_name: constr(min_length=1, max_length=200) = Field(..., description="Name of the project")
    date_of_creation: date = Field(..., description="Date of data entry creation (yyyy-mm-dd)")
    date_of_update: date = Field(..., description="Date of last data entry or edit (yyyy-mm-dd)")
    date_of_submission: date = Field(..., description="Date of data entry submission (yyyy-mm-dd)")
    pluscode: Optional[str] = Field(
        None,
        description="Absolute Open Location Code of this location (requires either lat long or open location code)",
    )
    project_address: Optional[str] = Field(None, description="Project address")
    project_location_city: Optional[str] = Field(None, description="Project city")
    project_address_lookup: Optional[str] = Field(None, description="Project address lookup (Google Maps)")
    project_state_or_province: Optional[str] = Field(
        None,
        description="Project state, province, or country subdivision",
    )
    project_country: constr(min_length=3, max_length=3) = Field(..., description="Project country (ISO 3166 Alpha-3)")

    project_postal_code: constr(min_length=3, max_length=3) = Field(
        ..., description="Project postal code (only first 3 digits required for Canada)"
    )
    project_climate_zone: Optional[List[ClimateZones]] = Field(
        None, description="Climate Zone per IECC (e.g., 1A, 2B, etc.)"
    )
    lat: Optional[condecimal(ge=-90, le=90)] = Field(
        None, description="Latitude, as a signed decimal (-90 ≤ value ≤ 90)"
    )
    lng: Optional[condecimal(ge=-180, le=180)] = Field(
        None, description="Longitude, as a signed decimal (-180 ≤ value ≤ 180)"
    )
    project_description: Optional[str] = Field(None, description="A brief description of the project.")
    project_image: Optional[str] = Field(None, description="Path or URL to the project image or rendering.")
    data_entry_contact_first_name: Optional[str] = Field(
        None, description="First name of the person submitting the data."
    )
    data_entry_contact_last_name: Optional[str] = Field(
        None, description="Last name of the person submitting the data."
    )
    data_entry_contact_email: Optional[str] = Field(
        None, description="Email address of the person submitting the data."
    )
    governing_code: Optional[str] = Field(
        None, description="Local or state building code, or IBC/IRC version if no local code exists."
    )
    project_data_anonymized: Optional[bool] = Field(
        None, description="Specifies if the project data has been anonymized."
    )
    project_certifications_commitments: Optional[List[Certifications]] = Field(
        None, description="List of third-party certifications or commitment programs the project is pursuing."
    )


class response_ProjectTeamContact(BaseModel):
    project_owner_contact_first_name: Optional[str] = Field(None, description="First name of the owner contact.")
    project_owner_contact_last_name: Optional[str] = Field(None, description="Last name of the owner contact.")
    owner_organization: Optional[str] = Field(None, description="Name of the owner's organization or company.")
    owner_web_domain: Optional[str] = Field(None, description="Web domain of the owner.")
    owner_country: Optional[str] = Field(
        None, description="Location of owner headquarters (country), as ISO3166-Alpha3."
    )
    owner_email: Optional[str] = Field(None, description="Email address of the owner or primary contact.")
    owner_type: Optional[OwnerType] = Field(
        None, description="Type of owner (e.g., Government, Corporate, Non-Profit)."
    )
    owners_representative: Optional[str] = Field(None, description="Name of the owner's representative organization.")
    architect_of_record: Optional[str] = Field(
        None, description="Organization serving as the Architect of Record (AOR)."
    )
    org_office: Optional[str] = Field(None, description="Studio or office within the firm organization.")
    general_contractor: Optional[str] = Field(None, description="General Contractor (GC) organization.")
    mep_engineer: Optional[str] = Field(None, description="MEP Engineer of Record organization.")
    sustainability_consultant: Optional[str] = Field(None, description="Green Building Consultant organization.")
    structural_engineer: Optional[str] = Field(None, description="Structural Engineer organization.")
    civil_engineer: Optional[str] = Field(None, description="Civil Engineer organization.")
    landscape_consultant: Optional[str] = Field(None, description="Landscape Consultant organization.")
    interior_designer: Optional[str] = Field(None, description="Interior Designer organization.")
    other_project_team: Optional[str] = Field(None, description="Other project stakeholder organization.")


class response_ProjectSchedule(BaseModel):
    project_construction_date_completion: Optional[date] = Field(
        None, description="Expected or actual construction end date (yyyy-mm-dd)."
    )
    project_status: Optional[ProjectStatus] = Field(None, description="Project status at time of data submission.")
    project_construction_date_start: Optional[date] = Field(
        None, description="Anticipated construction start date in ISO format (yyyy-mm-dd)."
    )

    project_construction_date_existing_building: Optional[Union[date, conint(gt=1000, le=2100)]] = Field(
        None, description="Year original asset was constructed for existing buildings (ISO Date or just year)."
    )


class response_BuildingOccupancy(BaseModel):
    occupant_load: Optional[conint(gt=0)] = Field(
        None, description="Number of people permitted to occupy the asset. Must be greater than 0."
    )
    full_time_equivalent: Optional[condecimal(gt=0)] = Field(
        None,
        description="Full-Time Equivalent (FTE). Represents the number of regular building occupants who spend 40 hours per week. Calculated as Total Occupant Hours ÷ 8.",
    )
    residential_units: Optional[conint(gt=0)] = Field(
        None, description="Number of residential units (if a residential asset)."
    )
    anticipated_start_building_occupancy: Optional[date] = Field(
        None, description="Anticipated Start of Occupancy (letter of occupancy) (yyyy-mm-dd)."
    )

    bedroom_count: Optional[float] = Field(
        None,
        description="Enter the number of bedrooms (if residential asset). Count bedroom units in studios as 0.5 and count 1 bedroom + den units as 1.5.",
    )


class response_ProjectUseConstruction(BaseModel):
    asset_type: AssetTypes = Field(..., description="Asset type.")
    building_construction_type: BuildingConstructionTypes = Field(
        ..., description="Select the appropriate building construction type."
    )
    building_use_type: UseTypes = Field(..., description="The usage type. Required if project type is building.")
    infrastructure_construction_type: InfrastructureConstructionTypes = Field(
        ..., description="Infrastructure construction type."
    )
    infrastructure_sector_type: Optional[SectorTypes] = Field(None, description="Infrastructure sector type.")
    infrastructure_use_type: Optional[List[InfrastructureUseTypes]] = Field(
        None,
        description="The infrastructure project usage type. If more than one option is applicable, select more than one.",
    )
    energy_code: Optional[EnergyCodes] = Field(None, description="Project energy code used.")
    omniclass_table_11_construction_entity: Optional[str] = Field(
        None, description="Options per Level 1: Refer to the OmniClass Table 11 Construction Entities by Function."
    )  # TODO: fill out the literal list here
    IBC_Construction_Type: Optional[List[IBCConstructionType]] = Field(
        None,
        description="Construction Type per IBC. Optional with submission of Architectural Project Documents with General Notes.",
    )
    project_surroundings: Optional[ProjectSurroundings] = Field(None, description="Type of area surrounding the asset.")
    development_site_type: Optional[DevelopmentSite] = Field(
        None, description="Identifies whether the lot being developed is a greenfield or brownfield site."
    )
    project_historic: Optional[HistoricValue] = Field(
        None, description="Whether or not the asset is of historical/cultural value."
    )

    @validator("building_use_type", always=True)
    def validate_building_use_type(cls, v, values):
        if values.get("asset_type") == "Building" and v is None:
            raise ValueError('building_use_type is required when asset_type is "Building".')
        return v


class response_ProjectSize(BaseModel):
    project_units: Literal["Imperial Units System (IP, USA)", "International Units System (SI)"] = Field(
        ..., description="The preferred units this project was entered in."
    )
    gfa_measurement_method: Literal[
        "BOMA 2018 Gross Areas: Standard methods of Measurement (ANSI/BOMA Z65.3-2018)",
        "ASHRAE/LEED",
        "IPMS 1 (External)",
        "IPMS 2 (Internal)",
        "Other",
    ] = Field(..., description="Method used to calculate the gross floor area.")

    gross_floor_area: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None,
        description="Gross floor area (GFA) associated with the selected usage type. Required if project type is building.",
    )
    project_site_area: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None, description="Total area within the legal property boundaries of a site. Recommended."
    )
    building_footprint_area: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None, description="Area of the building footprint, excluding hardscapes, landscapes, and other site works."
    )
    conditioned_floor_area: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None,
        description="The floor area within the building that is conditioned. Recommended if reporting operational carbon.",
    )
    unconditioned_floor_area: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None,
        description="The floor area within the building that is not conditioned. Recommended if reporting operational carbon.",
    )
    enclosed_parking_area: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None, description="Parking area located inside the building shell. Recommended."
    )
    detached_parking_area: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None, description="Parking area that is not attached to the building shell. Recommended."
    )
    stories_above_grade: Optional[int] = Field(None, description="Number of stories above grade. Recommended.")
    stories_below_grade: Optional[int] = Field(None, description="Number of stories below grade. Recommended.")
    building_height: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None, description="Total height of the building above finished ground level, per ASCE 7-16. Recommended."
    )
    project_units: str = Field(
        ...,
        description="The preferred units this project was entered in. This field has no effect on the data formats, but is useful in restoring the original units when displaying buildings.",
    )
    surface_parking_area: Optional[float] = Field(
        None,
        description="Refers to an open, ground-level parking facility where vehicles are parked directly on a paved surface. This type of parking area is not enclosed within a building and does not include structured parking, such as multi-level parking garages or underground parking facilities.",
    )
    detached_parking_structure_area: Optional[float] = Field(
        None,
        description="Refers to the area of a parking facility that is physically separated from the main building or structure it serves. This type of parking structure is typically a standalone facility, such as a parking garage, that is not directly attached to the main building by structural elements like walls or roofs.",
    )
    interstitial_floors: Optional[float] = Field(
        None,
        description="The number of floors located between the main floors of the building, often used for mechanical systems or storage.",
    )
    mean_roof_height: Optional[float] = Field(None, description="Project mean roof height.")
    window_wall_ratio: Optional[condecimal(gt=0, le=1)] = Field(
        None, description="The ratio of the window area to the gross exterior wall area."
    )
    thermal_envelope_area: Optional[float] = Field(
        None,
        description="The thermal envelope of a building includes all the exterior surfaces that enclose the conditioned space and separate it from unconditioned spaces or the outdoors. This includes walls, floors, roofs, windows, and doors. The thermal envelope area is crucial for determining the energy efficiency of a building, as it impacts heat loss and gain.",
    )


class response_ProjectCost(BaseModel):
    currency_code: Optional[CurrencyCodes] = Field(
        None, description="Local currency alphabetic code per ISO 4217. See: https://en.wikipedia.org/wiki/ISO_4217"
    )
    total_cost: Optional[confloat(ge=0)] = Field(None, description="Total Project Cost in the specified currency.")
    hard_cost: Optional[float] = Field(
        None, description="Hard costs include building materials and total construction cost."
    )
    soft_cost: Optional[confloat(ge=0)] = Field(
        None, description="Soft costs include design/consultant fees, overhead, and project administration costs."
    )
    siteworks_cost: Optional[confloat(ge=0)] = Field(None, description="Estimated cost of siteworks for the project.")
    cost_source: Optional[str] = Field(
        None,
        description="Whether the cost is estimated, based on the initial contract value (BId), or actual including change orders (COs).",
    )
    cost_notes: Optional[str] = Field(
        None, description="Open field to provide additional details or context related to project costs."
    )


class response_StructuralSystems(BaseModel):
    system_column_grid_long: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None, description="Typical column grid spacing in the long direction in feet. Recommended."
    )
    system_risk_category: Optional[RiskCategories] = Field(
        None, description="Project Risk Category based on IBC definition. Recommended."
    )
    system_snow_load: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None, description="Code-determined ground snow load in pounds per square foot or square meter. Recommended."
    )
    system_wind_speed_asce7: Optional[condecimal(gt=0, decimal_places=2)] = Field(
        None,
        description="Code-determined ultimate wind speed in miles per hour or km per hour, per ASCE 7-16. Recommended.",
    )
    earthquake_importance_factor: Optional[EarthquakeImportanceFactor] = Field(
        None,
        description="Earthquake Importance Factor, per National Building Code of Canada, 2020 table 4.1.8.5. Recommended.",
    )
    seismic_design_category_ibc: Optional[SeismicDesignCategory] = Field(
        None, description="Seismic design category, as determined by IBC. Recommended."
    )
    primary_horizontal_gravity_system: Optional[HorizontalGravitySystem] = Field(
        None, description="Primary horizontal gravity system. Recommended."
    )
    primary_vertical_gravity_system: Optional[VerticalGravitySystem] = Field(
        None, description="Primary vertical gravity system. Recommended."
    )
    system_lateral_system: Optional[LateralSystem] = Field(None, description="Primary lateral system. Recommended.")
    system_allowable_soil_bearing_pressure: Optional[str] = Field(
        None, description="Allowable soil bearing pressure, as reported by the geotechnical engineer. Recommended."
    )
    system_foundation_type: Optional[SystemFoundationType] = Field(
        None, description="Typical foundation type. Recommended."
    )
    system_live_load: Optional[float] = Field(
        None, description="Typical floor live load in pounds per square foot or square meter."
    )
    secondary_horizontal_gravity_system: Optional[HorizontalGravitySystem] = Field(
        None,
        description="Secondary horizontal gravity system.",
    )
    secondary_vertical_gravity_system: Optional[VerticalGravitySystem] = Field(
        None,
        description="Secondary vertical gravity system.",
    )
    system_podium: Optional[SystemPodium] = Field(
        None,
        description="Whether or not project is podium construction.",
    )
    system_allowable_soil_bearing_pressure: Optional[confloat(ge=0)] = Field(
        None, description="Allowable soil bearing pressure, as reported by the geotechnical engineer."
    )


class response_LCAInformation(BaseModel):
    tool_report_upload: Optional[str] = Field(None, description="Upload report from LCA tool. Recommended.")
    assessment_year: int = Field(
        ..., ge=1800, le=2200, description="Year when LCA or carbon assessment was completed. Required."
    )
    assessment_date: Optional[date] = Field(
        None, description="Date of assessment. Year must be provided at a minimum. Month and day recommended."
    )
    project_phase_at_time_of_assessment: ProjectPhase = Field(
        ..., description="Phase of the project when the LCA or carbon assessment was completed. Required."
    )
    tool_lca: LCATool = Field(..., description="Tool used to conduct the assessment. Required.")
    lca_tool_version_type: Optional[str] = Field(
        None,
        description="Version of tool and type used to conduct the assessment. If unknown, enter 'unknown'. Recommended.",
    )
    assessment_life_cycle_stages: Optional[List[LCAStages]] = Field(
        None, description="LCA stages included in embodied carbon modeling. Recommended."
    )
    required_service_life: Optional[conint(gt=0)] = Field(
        None, description="Service life required by the client or through regulations. Recommended."
    )
    reference_study_period: Optional[conint(gt=0)] = Field(
        None,
        description="Reference study period used in assessment modeling, if use and end of life phases included. Recommended.",
    )
    material_quantity_source: Optional[List[MaterialQtySource]] = Field(
        None, description="Main source of material quantities. Recommended."
    )
    report_name: Optional[str] = Field(None, description="Filename of the LCA Results. Must be unique.")
    additional_lca_report_name: Optional[str] = Field(
        None,
        description="Filename of the additional LCA Results that must be submitted apart from the main LCA Result.",
    )
    assessor_name: Optional[str] = Field(None, description="Name of person who conducted the LCA or carbon assessment.")
    assessor_email: Optional[str] = Field(
        None, description="Email of person who conducted the LCA or carbon assessment."
    )
    assessor_organization: Optional[str] = Field(
        None, description="Company, organization or affiliation of person who conducted the LCA or carbon assessment."
    )
    project_phase_at_reporting: Optional[ProjectPhaseReporting] = Field(
        None,
        description="The phase of the project when the LCA or carbon assessment was reported to database, commitment, or certification program.",
    )
    material_quantity_source_detail: Optional[str] = Field(
        None,
        description="If more than one material quantity source selected, provide additional detail on which materials and systems apply to each material quantity source.",
    )


class response_EnergyModelOperationalEnergy(BaseModel):
    tool_energy_model: EnergyModel = Field(
        ..., description="Tool used to perform the energy modeling. Required if reporting operational energy."
    )

    energy_model_methodology_reference: Optional[str] = Field(
        None, description="The energy modeling reference standard used. Recommended."
    )
    energy_model_tool_version: Optional[str] = Field(
        None, description="Version of software used for energy modeling. Recommended."
    )
    gwp_energy_sources_year: Optional[GWPEnergySource] = Field(
        None,
        description="Basis of the global warming potential for energy sources determined on a 20-year or 100-year basis. Recommended.",
    )

    site_location_weather_data: Optional[str] = Field(
        None,
        description="Weather data information of the site location based on ASHRAE's Weather Data Viewer. Includes weather station name, WMO station identifier, ASHRAE Climate Zone per ASHRAE Standard 169, and the year of accessing the weather file. Recommended.",
    )
    electricity_provider: Optional[str] = Field(
        None, description="Name of the electricity source provider. Recommended."
    )
    electricity_source: Optional[ElectricitySource] = Field(
        None, description="Type of electricity source. Recommended."
    )
    electricity_carbon_factor: Optional[condecimal(gt=0)] = Field(
        None,
        description="Electricity carbon factor (in kg CO2e/MWh), stated as either a single annualized value or as a list of sub-annual schedule-based values. Recommended.",
    )
    electricity_carbon_factor_source: Optional[str] = Field(
        None, description="State the source of the electricity carbon factor. Recommended."
    )


class response_Uncertainty(BaseModel):
    assessment_purpose: Optional[str] = Field(
        None,
        description="Describe the purpose or goal of the assessment. Per EN 15978, this includes the goal, scope, and intended use, such as reporting to a commitment program, third-party certification, or code compliance. Recommended.",
    )
    lcia_method: Optional[str] = Field(
        None, description="Life Cycle Impact Assessment (LCIA) method used. Recommended."
    )
    assessment_uncertainty: Optional[str] = Field(
        None,
        description="Describe uncertainty factors in the assessment. Confirm if contingency or data uncertainty factors were applied, and detail which life cycle modules, elements, and/or materials they were applied to. Recommended.",
    )
    assessment_methodology_description: Optional[str] = Field(
        None, description="Describe the methodology used to conduct the assessment."
    )
    assessment_cutoff_method: Optional[str] = Field(
        None,
        description="Describe the cutoff method used, if any, including the standard if applicable, the type (cost, mass, etc.), and quantity (percentage, specific values, etc.).",
    )


class response_Verification(BaseModel):
    assessment_verified: Optional[bool] = Field(
        None, description="Whether or not the assessment has been third-party verified. Recommended."
    )
    iso21931_compliance: Optional[bool] = Field(
        None, description="Was the assessment conducted in accordance with ISO21931-1:2022?"
    )
    en15978_compliance: Optional[bool] = Field(
        None, description="Was the assessment conducted in accordance with EN 15978-1?"
    )
    rics_2017_compliance: Optional[bool] = Field(
        None,
        description="Was the assessment conducted in accordance with RICS Whole Life Carbon Assessment - 1st edition (2017)?",
    )
    rics_2023_compliance: Optional[bool] = Field(
        None,
        description="Was the assessment conducted in accordance with RICS Whole Life Carbon Assessment - 2nd edition (2023)?",
    )
    ashraeicc_240p_compliance: Optional[bool] = Field(
        None,
        description="Was the assessment conducted in accordance with ASHRAE/ICC Standard 240P Quantification of Life Cycle Greenhouse Gas Emissions in Buildings?",
    )
    sei_prestandard_compliance: Optional[bool] = Field(
        None,
        description="Was the assessment conducted in accordance with the SEI Prestandard for Assessing the Embodied Carbon of Structural Systems for Buildings?",
    )
    assessment_verifier: Optional[str] = Field(None, description="Name of third-party verifier")
    assessment_validity_period: Optional[float] = Field(
        None, description="Period for which assessment is valid (in years)"
    )
    results_validation_description: Optional[str] = Field(
        None, description="How were these results and material quantities validated?"
    )


class response_Inclusions(BaseModel):
    operational_energy_included: bool = Field(..., description="Is operational energy use reported?  Required.")
    biogenic_carbon_storage_included: bool = Field(
        ..., description="If assessment includes biogenic carbon storage in building materials. Required."
    )
    biogenic_carbon_accounting_method: Optional[BiogenicCarbonAccounting] = Field(
        None, description="What method was used to calculate biogenic carbon? Recommended."
    )
    bio_sustainability_certification: Optional[List[BiogenicCertification]] = Field(
        None, description="3rd party certification for sourcing of bio-based and forestry products. Recommended."
    )
    biogenic_carbon_description: Optional[str] = Field(
        None, description="Provide a detailed explanation of the bio-based materials used in the project. Recommended."
    )
    project_refrigerants: bool = Field(
        ..., description="Does the assessment include impacts from refrigerants? Required."
    )
    substructure_included: bool = Field(
        ..., description="Is the substructure physical scope included in the reported calculations? Required."
    )
    substructure_scope: Optional[List[SubstructureScope]] = Field(
        None, description="Which substructure components are included in the reported calculations? Recommended."
    )
    shell_superstructure_included: bool = Field(
        ..., description="Is the shell-superstructure physical scope included in the reported calculations?  Required."
    )
    shell_superstructure_scope: Optional[List[ShellSuperstructureScope]] = Field(
        None, description="Which superstructure components are included in the reported calculations? Recommended."
    )
    shell_exterior_enclosure_included: bool = Field(
        ...,
        description="Is the shell-exterior enclosure physical scope included in the reported calculations? Required.",
    )
    shell_exterior_enclosure_scope: Optional[List[ShellExteriorScope]] = Field(
        None,
        description="Which shell-exterior enclosure components are included in the reported calculations? Recommended.",
    )
    interior_construction_included: bool = Field(
        ...,
        description="Is the interiors - construction physical scope included in the reported calculations? Required.",
    )
    interior_construction_scope: Optional[List[InteriorConstructionScope]] = Field(
        None,
        description="Which interior construction components are included in the reported calculations? Recommended.",
    )
    interiors_finishes_included: bool = Field(
        ..., description="Is the interiors - finishes physical scope included in the reported calculations? Required."
    )
    interior_finishes_scope: Optional[List[InteriorFinishesScope]] = Field(
        None,
        description="Which interiors - finishes components are included in the reported calculations? Recommended.",
    )
    services_mep_included: bool = Field(
        ..., description="Is the services physical scope included in the reported calculations? Required."
    )
    services_mechanical_scope: Optional[List[ServicesMechanicalScope]] = Field(
        None, description="Which mechanical components are included in the reported calculations? Recommended."
    )
    services_electrical_scope: Optional[List[ServicesElectricalScope]] = Field(
        None, description="Which electrical components are included in the reported calculations? Recommended."
    )
    services_plumbing_scope: Optional[List[ServicesPlumbingScope]] = Field(
        None,
        description="Which plumbing and fire protection components are included in the reported calculations? Recommended.",
    )
    sitework_included: bool = Field(
        ..., description="Is the sitework physical scope included in the reported calculations? Required."
    )
    sitework_scope: Optional[List[SiteworkScope]] = Field(
        None, description="Which sitework components are included in the reported calculations? Recommended."
    )
    equipment_included: bool = Field(..., description="Is equipment included in the reported calculations? Required.")
    equipment_scope: Optional[List[EquipmentScope]] = Field(
        None, description="Which equipment components are included in the reported calculations? Recommended."
    )
    furnishings_included: bool = Field(
        ..., description="Are furnishings included in the reported calculations? Required."
    )
    furnishings_scope: Optional[List[FurnishingScope]] = Field(
        None, description="Which furnishings components are included in the reported calculations? Recommended."
    )
    infrastructure_components_included: Optional[bool] = Field(
        None, description="Are infrastructure components included in the reported calculations? Recommended."
    )
    refrigerant_type_included: Optional[list[RefrigerantTypes]] = Field(
        None, description="Which refrigerants were utilized on the project and included in the assessment?"
    )
    fossil_gas_leakage: Optional[bool] = Field(
        None, description="Does the assessment include impacts from fossil gas leakage?"
    )
    lca_requirements: Optional[str] = Field(
        None,
        description="Does the project have to meet GWP and/or other LCA requirements as set forth by project owner, federal or local policy, code, project team or other entity? If so, explain the requirements in detail.",
    )


class response_GWP(BaseModel):
    GWP_total: float = Field(..., description="Total quantity (in kg CO2e) of GWP")
    GWP_fossil: Optional[float] = Field(None, description="Total quantity (in kg CO2e) of GWP fossil")
    GWP_luluc: Optional[float] = Field(None, description="Total quantity (in kg CO2e) of GWP luluc")
    GWP_bio_total: Optional[float] = Field(None, description="Total quantity (in kg CO2e) of GWP biogenic")
    GWP_bio_emissions: Optional[float] = Field(
        None, description="Total quantity (in kg CO2e) of GWP biogenic emissions"
    )
    GWP_bio_storage: Optional[float] = Field(None, description="Total quantity (in kg CO2e) of GWP biogenic storage")
    AP_total: Optional[float] = Field(
        None, description="Total quantity (in kg SO2e) of AP (acidification potential of land and water)."
    )
    EP_total: Optional[float] = Field(None, description="Total quantity (in kg PO4e) of EP (eutrophication potential).")
    ODP_total: Optional[float] = Field(
        None, description="Total quantity (kg CFC-11e) of ODP (ozone depletion potential)."
    )
    POCP_total: Optional[float] = Field(
        None,
        description="Total quantity (kg C2H4e) of POCP (photochemical ozone creation potential, aka photochemical smog potential).",
    )
    ADP_total: Optional[float] = Field(
        None, description="Total quantity (kg Sbe) of ADP (abiotic depletion potential)."
    )
    CED_total: Optional[float] = Field(None, description="Total quantity (MJ) of CED (cumulative energy demand).")


class response_B6(BaseModel):
    energy_use_predicted_net: Optional[float] = Field(None, description="Predicted net energy use in kBTU")
    energy_use_predicted_gross: Optional[float] = Field(None, description="Predicted gross energy use in kBTU")
    energy_end_use: Optional[str] = Field(None, description="Associated end use")
    fuel_type: Optional[str] = Field(None, description="Associated fuel type")
    GWP_total: Optional[float] = Field(None, description="Total GWP in kg CO2e")
    GWP_fossil: Optional[float] = Field(None, description="Total GWP fossil in kg CO2e")
    GWP_luluc: Optional[float] = Field(None, description="Total GWP luluc in kg CO2e")
    GWP_bio_total: Optional[float] = Field(None, description="Total GWP biogenic in kg CO2e")
    GWP_bio_emissions: Optional[float] = Field(None, description="Total GWP biogenic emissions in kg CO2e")
    GWP_bio_storage: Optional[float] = Field(None, description="Total GWP biogenic storage in kg CO2e")


class response_B7(BaseModel):
    water_source_provider: Optional[str] = Field(None, description="Name of water source provider")
    water_type: Optional[str] = Field(None, description="Type of water/wastewater")
    water_consumption: Optional[float] = Field(None, description="Water consumption in m3/year")
    GWP_total: Optional[float] = Field(None, description="Total GWP in kg CO2e")
    GWP_fossil: Optional[float] = Field(None, description="Total GWP fossil in kg CO2e")
    GWP_luluc: Optional[float] = Field(None, description="Total GWP luluc in kg CO2e")
    GWP_bio_total: Optional[float] = Field(None, description="Total GWP biogenic in kg CO2e")
    GWP_bio_emissions: Optional[float] = Field(None, description="Total GWP biogenic emissions in kg CO2e")
    GWP_bio_storage: Optional[float] = Field(None, description="Total GWP biogenic storage in kg CO2e")


class response_LCAStages(BaseModel):
    A1_A3: response_GWP = Field(..., description="Life Cycle Stage A1-A3 Product Stage")
    A4: Optional[response_GWP] = Field(None, description="Life Cycle Stage A4 Transportation")
    A5_total: Optional[response_GWP] = Field(None, description="Life Cycle Stage A5 Construction Installation Process")
    A5p1: Optional[response_GWP] = Field(
        None,
        description="Life Cycle Stage A5.1 Pre-Construction Demolition includes Demolition/ deconstruction of existing buildings and structures, and/ or parts thereof, including transport from site and waste processing of removed materials.",
    )
    A5p2: Optional[response_GWP] = Field(
        None,
        description="Life Cycle Stage A5.2 Construction Activities includes Site preparation; temporary works; ground works; connection to utilities; transport and onsite storage of construction products, materials and equipment; onsite production/assembly of products; works for the installation and ancillary materials (e.g. formworks and their disposal); heating/ cooling/ventilation of site facilities; energy and water use for construction processes and landscaping",
    )
    A5p3: Optional[response_GWP] = Field(
        None,
        description="Life Cycle Stage A5.3 Waste and Waste Management includes Production, transportation, storage and end-of-life treatment and disposal of any material/waste onsite; transport, waste management and disposal of packing materials.",
    )
    A5p4: Optional[response_GWP] = Field(
        None,
        description="Life Cycle Stage A5.4 Worker Transport includes emissions of site workers traveling to and from site.",
    )
    B1_total: Optional[response_GWP] = Field(None, description="Life Cycle Stage B1 Use Stage")
    B1p1: Optional[response_GWP] = Field(None, description="Life Cycle Stage B1.1 Material Emissions and Uptake")
    B1p2: Optional[response_GWP] = Field(None, description="Life Cycle Stage B1.2 Fugitive Emissions")
    B2: Optional[response_GWP] = Field(None, description="Life Cycle Stage B2 Maintenance Emissions")
    B3: Optional[response_GWP] = Field(None, description="Life Cycle Stage B3 Repair Emissions")
    B4: Optional[response_GWP] = Field(None, description="Life Cycle Stage B4 Replacement Emissions")
    B5: Optional[response_GWP] = Field(None, description="Life Cycle Stage B5 Refurbishment Emissions")
    B6: response_B6 = Field(response_B6(), description="Life Cycle Stage B6 Operational Energy")
    B7: response_B7 = Field(response_B7(), description="Life Cycle Stage B7 Operational Water Use")
    B8: Optional[response_GWP] = Field(None, description="Life Cycle Stage B8 Other Operational Processes")
    C1: Optional[response_GWP] = Field(None, description="Life Cycle Stage C1 Deconstruction")
    C2: Optional[response_GWP] = Field(None, description="Life Cycle Stage C2 End-of-Life Transport")
    C3: Optional[response_GWP] = Field(None, description="Life Cycle Stage C3 Waste Processing for Recovery")
    C4: Optional[response_GWP] = Field(None, description="Life Cycle Stage C4 End-of-Life Disposal")
    D_total: Optional[response_GWP] = Field(
        None,
        description="Life Cycle Stage D Benefits and loads beyond the system boundary (Reuse, Recovery, Recycling potential).",
    )
    D1: Optional[response_GWP] = Field(
        None,
        description="Life Cycle Stage D1 All environmental loads and benedits from future substitution of resources due to reused products, recycled materials, secondary fuelds, and recovered energy leaving a project for use in a subsequent product system as material.",
    )
    D2: Optional[response_GWP] = Field(
        None,
        description="Life Cycle Stage D2 All environmental loads and benefits for recovered and exported energy used to meet the energy demand outside of the project. ",
    )


class response_LCAResults(BaseModel):
    GWP_total: float = Field(..., description="Total project GWP in kilograms of CO2 equivalent.")
    GWP_intensity_per_building_area: Optional[float] = Field(None, description="In kg CO2e/m2.")
    substructure: Optional[response_LCAStages] = Field(None)
    shell_superstructure: Optional[response_LCAStages] = Field(None)
    shell_exterior_enclosure: Optional[response_LCAStages] = Field(None)
    interior_construction: Optional[response_LCAStages] = Field(None)
    interior_finishes: Optional[response_LCAStages] = Field(None)
    services_mep: Optional[response_LCAStages] = Field(None)
    sitework: Optional[response_LCAStages] = Field(None)
    equipment: Optional[response_LCAStages] = Field(None)
    furnishings: Optional[response_LCAStages] = Field(None)


class response_ReductionStrategies(BaseModel):
    reduction_baseline: Optional[str] = Field(
        None,
        description="If a baseline scenario assessment was conducted, enter the total GWP of the baseline model here.",
    )
    reduction_percentage_from_reference: Optional[float] = Field(
        None, description="Percent reduction from a baseline (if applicable)."
    )
    reduction_description: Optional[str] = Field(None, description="Describe reduction strategies pursued.")