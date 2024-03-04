import { Body, Controller, Get, HttpCode, Param, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { EditProfileDto } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @UseGuards(AuthenticationGuard)
    @Get()
    async profile(
        @Req() { user },
    ) {
        return this.profileService.profile(user.id);
    }

    @UseInterceptors(FileInterceptor('profileImage', {
        storage: diskStorage({
            destination: './uploads/images',
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
    @HttpCode(200)
    @UseGuards(AuthenticationGuard)
    @Put()
    async updateProifle(
        @Req() { user },
        @UploadedFile() profileImage: Express.Multer.File,
        @Body() body: EditProfileDto,
    ) {
        return this.profileService.updateProifle(
            user.id,
            profileImage,
            body,
        );
    }

    @Get('images/:fileId')
    async getfileUpload(@Param('fileId') fileId, @Res() res) {
        res.sendFile(fileId, { root: './uploads/images' });
    }
}
