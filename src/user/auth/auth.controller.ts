import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SigninDto, SignupDto } from './dtos/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseInterceptors(FileInterceptor('profileImage', {
        storage: diskStorage({
            destination: '/tmp',
            filename: (req, file, cb) => {
                const name = file.originalname.split('.')[0]
                const fileExtentios = file.originalname.split('.')[1]
                const newFile = `${name}_${Date.now()}.${fileExtentios}`
                cb(null, newFile)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(null, false)
            }
            cb(null, true)
        }
    }))
    @Post('signup')
    async signup(
        @Body() body: SignupDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.authService.signup(body, file);
    }

    @Post('signin')
    async signin(
        @Body() body: SigninDto,
    ) {
        return this.authService.signin(body);
    }
}
