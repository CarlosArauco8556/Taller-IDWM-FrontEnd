/**
 * Interface para los parámetros de la consulta
 */
export interface IQueryParams {
    isDescendingDate: boolean | null;  // Orden descendente por fecha
    userName:string;                   // Nombre de usuario
    page: number;                      // Página
    pageSize: number;                  // Tamaño de la página
}