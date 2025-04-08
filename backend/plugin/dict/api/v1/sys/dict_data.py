
from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query

from backend.common.pagination import DependsPagination, PageData, paging_data
from backend.common.response.response_schema import ResponseModel, ResponseSchemaModel, response_base
from backend.common.security.jwt import DependsJwtAuth
from backend.common.security.permission import RequestPermission
from backend.common.security.rbac import DependsRBAC
from backend.database.db import CurrentSession
from backend.plugin.dict.schema.dict_data import (
    CreateDictDataParam,
    GetDictDataDetail,
    GetDictDataWithRelation,
    UpdateDictDataParam,
)
from backend.plugin.dict.service.dict_data_service import dict_data_service

router = APIRouter()


@router.get('/{pk}', summary='获取字典详情', dependencies=[DependsJwtAuth])
async def get_dict_data(
    pk: Annotated[int, Path(description='字典数据 ID')],
) -> ResponseSchemaModel[GetDictDataWithRelation]:
    data = await dict_data_service.get(pk=pk)
    return response_base.success(data=data)


@router.get(
    '',
    summary='分页获取所有字典',
    dependencies=[
        DependsJwtAuth,
        DependsPagination,
    ],
)
async def get_pagination_dict_datas(
    db: CurrentSession,
    label: Annotated[str | None, Query(description='字典数据标签')] = None,
    value: Annotated[str | None, Query(description='字典数据键值')] = None,
    status: Annotated[int | None, Query(description='状态')] = None,
) -> ResponseSchemaModel[PageData[GetDictDataDetail]]:
    dict_data_select = await dict_data_service.get_select(label=label, value=value, status=status)
    page_data = await paging_data(db, dict_data_select)
    return response_base.success(data=page_data)


@router.post(
    '',
    summary='创建字典',
    dependencies=[
        Depends(RequestPermission('sys:dict:data:add')),
        DependsRBAC,
    ],
)
async def create_dict_data(obj: CreateDictDataParam) -> ResponseModel:
    await dict_data_service.create(obj=obj)
    return response_base.success()


@router.put(
    '/{pk}',
    summary='更新字典',
    dependencies=[
        Depends(RequestPermission('sys:dict:data:edit')),
        DependsRBAC,
    ],
)
async def update_dict_data(
    pk: Annotated[int, Path(description='字典数据 ID')], obj: UpdateDictDataParam
) -> ResponseModel:
    count = await dict_data_service.update(pk=pk, obj=obj)
    if count > 0:
        return response_base.success()
    return response_base.fail()


@router.delete(
    '',
    summary='批量删除字典',
    dependencies=[
        Depends(RequestPermission('sys:dict:data:del')),
        DependsRBAC,
    ],
)
async def delete_dict_data(pk: Annotated[list[int], Query(description='字典数据 ID 列表')]) -> ResponseModel:
    count = await dict_data_service.delete(pk=pk)
    if count > 0:
        return response_base.success()
    return response_base.fail()
