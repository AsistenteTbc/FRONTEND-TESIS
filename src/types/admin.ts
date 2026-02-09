export interface IProvince {
  id: number;
  name: string;
}

export interface ICity {
  id: number;
  name: string;
  zipCode: string;
  provinceId: number;
  province?: IProvince;
}

export interface ILaboratorio {
  id: number;
  name: string;
  address: string;
  phone: string;
  horario: string;
  provinceId: number;
  province?: IProvince;
}
