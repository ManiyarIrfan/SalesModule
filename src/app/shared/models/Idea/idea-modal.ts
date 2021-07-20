import { string } from '@amcharts/amcharts4/core'

export interface IIdeaInsertModal{

    IdeaId :number, 
	EmployeeId :number,
    ProcessArea :string,    
	Subject :string,
    Details:string,
    BusinessBenefits:string,
	ImageUrl :string,
	Rating :string,
	Remark :string,    
    IdeaStatus :string,
    EntityId :string,

    Status :string,
    PopupWarningMsg: string,
    DeleteFileUrl: any,
    DbImageUrlList: any

    IdeaReviewId :number,	
	IdeaRating :number,
    Originality:number,
	Viability :number,
	Desirability :number,
    Feasibility :number,
  
    Comments :string,
    CommentId: number,
    
    Comment: string,
   
    
    Name:string,
    date:Date,
   
    input:string,
}
