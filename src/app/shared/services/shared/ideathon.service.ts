import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdeathonService {
  constructor(public http: HttpClient) { }
   
  GetIdea_ReveiwDetails = (user, input, ideaId) => {
    const url = `${environment['hrApiUrl']}api/Ideathone/GetIdeathonDetails/UserId,EntityId,UserType,Input,IdeaId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&EmployeeId=${user.EntityId}&Input=${input}&IdeaId=${ideaId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  insertUpdate_all = (user, allideaModel,uploadIdeafile) => {
    let data = {
      insertUpdateIdea: {
        ideaId: allideaModel.IdeaId ? allideaModel.IdeaId : null,
        processArea: allideaModel.ProcessArea ? allideaModel.ProcessArea : null,
        employeeId: user.EntityId ? user.EntityId : null,
        subject: allideaModel.Subject ? allideaModel.Subject : null,
        rating: allideaModel.Rating ? allideaModel.Rating : null,
        details: allideaModel.Details ? allideaModel.Details : null,
        businessBenefits: allideaModel.BusinessBenefits ? allideaModel.BusinessBenefits : null,
        imageUrl: allideaModel.ImageUrl ? allideaModel.ImageUrl : null,//Url
        remark: allideaModel.Remark ? allideaModel.Remark : null,//for status change
        status: allideaModel.IdeaStatus ? allideaModel.IdeaStatus : null,
        EntityId: user.EntityId ? user.EntityId : null,

        ideaReviewId: allideaModel.IdeaReviewId ? allideaModel.IdeaReviewId : null,       
         ideaRating: allideaModel.IdeaRating ? allideaModel.IdeaRating : null,
        originalityOfConcept: allideaModel.Originality ? allideaModel.Originality : null,
        viability: allideaModel.Viability ? allideaModel.Viability : null,
        desirablity: allideaModel.Desirability ? allideaModel.Desirability : null,
        feasibility: allideaModel.Feasibility ? allideaModel.Feasibility : null,

        commentId: allideaModel.CommentId ? allideaModel.CommentId : null,
        comment: allideaModel.Comment ? allideaModel.Comment : null,

       input: allideaModel.input ? allideaModel.input : null,
      },
      documents: uploadIdeafile ? uploadIdeafile : [],
      dbImageUrlList: allideaModel.DbImageUrlList ? allideaModel.DbImageUrlList : null,
      deleteFileUrl: allideaModel.DeleteFileUrl ? allideaModel.DeleteFileUrl : null
    }
    return this.http.post(`${environment['hrApiUrl']}api/Ideathone/InsertUpdateIdeathone/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`,
      data).pipe(map(x => x), take(1));
  }  




  
}