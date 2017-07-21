import {Injectable} from '@angular/core';
import {HttpService} from "../../providers/HttpService";
import {Observable} from "rxjs";
import {UserInfo} from "../../model/UserInfo";

@Injectable()
export class LoginService {
  constructor(private httpService: HttpService) {
  }


  login(user): Observable<UserInfo> {
    // return this.httpService.post('/app/bugRepair/login', user).map((res: Response) =>  res.json());
    let userInfo = {
      id: 1,
      username: user.username,
      name: '',
      email: '',
      phone: '',
      avatarId: '',
      description: ''
    };
    return Observable.create((observer) => {
      observer.next(userInfo);
    });
  }

}
