using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedPlaylistSongs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PlaylistSongs",
                table: "PlaylistSongs");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PlaylistSongs");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PlaylistSongs",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlaylistSongs",
                table: "PlaylistSongs",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistSongs_PlaylistId",
                table: "PlaylistSongs",
                column: "PlaylistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PlaylistSongs",
                table: "PlaylistSongs");

            migrationBuilder.DropIndex(
                name: "IX_PlaylistSongs_PlaylistId",
                table: "PlaylistSongs");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "PlaylistSongs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlaylistSongs",
                table: "PlaylistSongs",
                columns: new[] { "PlaylistId", "SongId" });
        }
    }
}
