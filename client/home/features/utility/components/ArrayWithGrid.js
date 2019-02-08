// import React, { Component } from 'react';
// import { Grid, Row, Col } from 'react-bootstrap';

// export const ArrayWithGrid = ({row = 0, col = 0, xsCol = 1, dataArray = [], CellComponent = 'div'}) => {
//     let totalCellNumber = row*col;
//     let gridComponentArray = [];

//     let rowComponentArray = [];
//     // let gridData = dataArray.slice(0, totalCellNumber);
//     let gridData = [];
//     if (dataArray != null && dataArray.length > 0){
//         gridData = dataArray.slice(0, totalCellNumber);
//     }

//     var col_id = 0;
//     for (var row_id = 0; row_id < row; row_id++) {
//         rowComponentArray.push({
//             row: gridData.slice(parseInt(col_id), parseInt(col_id) + parseInt(col)).map((data, index) => {
//                 data.col_id = row_id.toString().concat(index);
//                 return data;
//             }),
//             row_id: row_id
//         });
//         col_id = parseInt(col_id) + parseInt(col);
//     }

//     return (
//         <Grid fluid>
//             {rowComponentArray.map(rowComponent => (
//                 <Row key={rowComponent.row_id}>
//                     {rowComponent.row.map(cell => (
//                         <Col key={cell.col_id} xs={12/xsCol} sm={12/col}>
//                             <CellComponent cell={cell} />
//                         </Col>
//                     )) }
//                 </Row>
//             ))}
//         </Grid>
//     );
// }

// export default ArrayWithGrid;
