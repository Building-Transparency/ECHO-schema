from pydantic import BaseModel, Field, conint, constr, conlist, condecimal, confloat, validator
from typing import List, Optional, Literal, Union
from datetime import date, datetime


###########################
# Import Sections
###########################


from ._sections import (
                response_ProjectInformation,
                response_ProjectTeamContact,
                response_ProjectSchedule,
                response_BuildingOccupancy,
                response_ProjectUseConstruction,
                response_ProjectSize,
                response_ProjectCost,
                response_StructuralSystems,
                response_LCAInformation,
                response_EnergyModelOperationalEnergy,
                response_Uncertainty,
                response_Verification,
                response_Inclusions,
                response_LCAResults,
                response_ReductionStrategies,
                )


###########################
# Assemble Nested Schema
###########################

class nested_ECHO(BaseModel):
    project_description: response_ProjectInformation
    project_team: response_ProjectTeamContact
    project_schedule: response_ProjectSchedule
    building_occupancy: response_BuildingOccupancy
    project_use_construction_type: response_ProjectUseConstruction
    project_size: response_ProjectSize
    project_costs: response_ProjectCost
    structural_system: response_StructuralSystems
    lca_info: response_LCAInformation
    operational_energy: response_EnergyModelOperationalEnergy
    modeling_parameters: response_Uncertainty
    compliance_verification: response_Verification
    inclusions: response_Inclusions
    lca_results: response_LCAResults
    reduction_strategies: response_ReductionStrategies

    @validator("project_size", always=True)
    def validate_gross_floor_area(cls, v, values):
        if values.get("project_use_construction_type").asset_type == "Building" and v.gross_floor_area is None:
            raise ValueError('gross_floor_area is required when asset_type is "building".')
        return v

    class Config:
        validate_assignment = True


class flat_ECHO(
    response_ProjectInformation,
    response_ProjectTeamContact,
    response_ProjectSchedule,
    response_BuildingOccupancy,
    response_ProjectUseConstruction,
    response_ProjectSize,
    response_ProjectCost,
    response_StructuralSystems,
    response_LCAInformation,
    response_EnergyModelOperationalEnergy,
    response_Uncertainty,
    response_Verification,
    response_Inclusions,
    response_LCAResults,
    response_ReductionStrategies,
):
    @validator("gross_floor_area", always=True)
    def validate_gross_floor_area(cls, v, values):
        if values.get("asset_type") == "Building" and v is None:
            raise ValueError('gross_floor_area is required when asset_type is "building".')
        return v

    class Config:
        validate_assignment = True
